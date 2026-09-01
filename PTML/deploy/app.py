from flask import Flask, request, send_from_directory, redirect, url_for, render_template, current_app
from werkzeug.utils import secure_filename
import os
import threading
import time
import uuid
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

try:
    FLAG = open("./flag", "r").read()
except:
    FLAG = "[**FLAG**]"

@app.route('/')
def index():
    file = request.args.get('file', 'uploads/default.svg')
    return render_template('index.html', file=file)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
        filename = secure_filename(file.filename)
        unique_id = uuid.uuid4().hex
        unique_filename = f"{unique_id}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        read_file(unique_filename)
        return redirect(url_for('index', file=f'uploads/{unique_filename}'))
    return '', 204

def read_file(filename):
    driver = None
    cookie = {"name": "flag", "value": FLAG}
    cookie.update({"domain": "127.0.0.1"})
    try:
        service = Service(executable_path="/usr/local/bin/chromedriver")
        options = webdriver.ChromeOptions()
        for arg in [
            "headless",
            "window-size=1920x1080",
            "disable-gpu",
            "no-sandbox",
            "disable-dev-shm-usage",
        ]:
            options.add_argument(arg)

        driver = webdriver.Chrome(service=service, options=options)
        driver.implicitly_wait(3)
        driver.set_page_load_timeout(3)

        driver.get("http://127.0.0.1:8000/")
        driver.add_cookie(cookie)
        driver.get(f"http://127.0.0.1:8000/?file=uploads/{filename}")
        
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "svg")))

    except Exception as e:
        driver.quit()
        return False
    driver.quit()
    return True

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
