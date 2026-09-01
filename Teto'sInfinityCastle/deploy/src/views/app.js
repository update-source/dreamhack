function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
    toast.classList.add('hidden');
  }, 3000);
}


window.addEventListener('load', () => {
  const popup = document.getElementById('popup');
  const popupBanner = document.getElementById('popup-banner');
  const overlay = document.getElementById('popup-overlay');
  const wrapper = document.getElementById('wrapper');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  popup.style.display = 'block';
  overlay.style.display = 'block';
  wrapper.style.display = 'none';

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      popup.style.display = 'none';
      overlay.style.display = 'none';
      popupBanner.style.display = 'none';
      loadingSpinner.classList.remove('hidden');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || 'An error occurred. Please try again.');
        popup.style.display = 'block';
        overlay.style.display = 'block';
        popupBanner.style.display = 'block';
        loadingSpinner.classList.add('hidden');
        return;
      }

      const accessToken = data.access_token;
      localStorage.setItem('access_token', accessToken);

      const sceneResponse = await fetch('/api/scene/random', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const sceneData = await sceneResponse.json();

      loadingSpinner.classList.add('hidden');
      wrapper.style.display = 'block';

      initScenes(sceneData);
    } catch (error) {
      showToast(error.message || 'An error occurred. Please try again.');
    }

  });
});

function initScenes(scenes){
  let currentScene = 0;

  const nextScene = () => {
    const scene = scenes[++currentScene % scenes.length];
    if (document.body.className !== scene) {
      document.body.className = scene;
    }
  };

  let interval = setInterval(nextScene, 294 * 4);

  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case '0': case '1': case '2': case '3': case '4': case '5': case '6':
        e.preventDefault();
        clearInterval(interval);

        if (e.key === '0') {
          currentScene = 0;
          interval = setInterval(nextScene, 294 * 4);
          document.body.className = 'scene-1';
        } else {
          document.body.className = `scene-${e.key}`;
        }
        break;
      default:
        break;
    }
  });

  const audio = document.querySelector('audio');
  const audioButton = document.querySelector('#audio');
  audio.play();
  audioButton.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      audioButton.className = 'unmuted';
    } else {
      audio.pause();
      audioButton.className = 'muted';
    }
  });
};
