<?php

$data = json_decode('{"username": true}');


$username = $data->username;

print_r($username);

switch($username){
    case "admin":
        print_r("Ok");
};
?>