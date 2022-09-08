<?php

// Connect to Database
$bdd = new mysqli('localhost', 'root', '', 'delta');
if ($bdd->connect_error){
    http_response_code(500);
    die("Connexion impossible");
}

// Check the HTTP verb used in the client's request
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['uuid'])){
            getDelta($_GET['uuid']);
        }
        break;
    case 'POST':
        postDelta($_POST);
        break;
    case 'PUT':
    case 'PATCH':
        break;
    case 'DELETE':
        break;
}

// Save a delta in database
function postDelta($data) {
    global $bdd;
    $delta = $bdd->real_escape_string($data['delta']);
    $encrypted = $bdd->real_escape_string($data['encrypted']);
    $autodelete = $bdd->real_escape_string($data['autodelete']);
    $uuid = guidv4();

    $sql = "INSERT INTO delta.deltas (delta, uuid, encrypted, autodelete) VALUES ('$delta','$uuid','$encrypted','$autodelete')";
    $bdd->query($sql) or die($bdd->error);
    echo($uuid);
}

// Return a delta identified by its UUID
function getDelta($data) {
    global $bdd;
    $uuid = $bdd->real_escape_string($data);

    $sql = "SELECT * FROM delta.deltas WHERE uuid='$uuid'";
    $rec = $bdd->query($sql) or die($bdd->error);
    if ($delta=$rec->fetch_object()) {
        if($delta->autodelete == 'true'){
            deleteDelta($uuid);
        }
        echo(json_encode($delta));
    }
}

// Delete delta (only when autodelete is enabled)
function deleteDelta($uuid) {
    global $bdd;
    $sql = "DELETE FROM delta.deltas WHERE uuid='$uuid'";
    $bdd->query($sql) or die($bdd->error);
}

// Generate a random UUID
function guidv4() {
    if (function_exists('com_create_guid') === true){
        return trim(com_create_guid(), '{}');
    }

    $data = openssl_random_pseudo_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}