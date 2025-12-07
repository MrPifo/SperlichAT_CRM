<?php
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: token, Content-Type');
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Methods: POST");

    require_once 'lib/utils.php';
    require_once 'lib/dbInfo.php';
    require_once 'lib/auth.php';
    
    $data = getBody();

    try {
        $token = $data["token"];
        
        logout($token);
        echo getResponse(200, null, null);
    } catch(Exception $e) {
        echo getResponse(401, null, $e->getMessage());
    }
?>