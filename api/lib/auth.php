<?php
require_once("lib/utils.php");

function getAuthToken() {
    $authHeader = getallheaders()['Authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;
    if($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return $matches[1];
    }
    return null;
}
function isLoggedIn($token = null): bool {
    if (empty($token)) {
        $token = getAuthToken();
    }

    $row = getDB()->row("
        SELECT COUNT(1) as Amount
        FROM AUTHORIZATION
        WHERE TOKEN = :token
        AND CREATE_DATE > (NOW() - INTERVAL 48 HOUR) LIMIT 1
    ", ['token' => $token]);

    return $row->Amount == 1;
}
function login($user, $password) {
    $passwordHash = getDB()->row("
        SELECT PASSWORD
        FROM USER
        WHERE USERID = :user
        LIMIT 1
    ", ['user' => $user]);

    if(empty($passwordHash) == false) {
        return password_verify($password, $passwordHash->PASSWORD);
    }

    return false;
}
function logout($token) {
    getDB()->run("DELETE FROM AUTHORIZATION WHERE TOKEN = :token", ['token' => $token]);
}
function generateLoginToken($userId) {
    $personId = getPersonIdByUser($userId);
    
    if(empty($personId) == false) {
        $token = bin2hex(random_bytes(32));
        $createDate = date('Y-m-d H:i:s');
        $expireDate = date('Y-m-d H:i:s', strtotime('+48 hours'));
        getDB()->run("DELETE FROM AUTHORIZATION WHERE PERSON_ID = :userId OR EXPIRE_DATE < NOW()", ['userId' => $personId]);
        getDB()->insert("AUTHORIZATION", [
            "TOKEN" => $token,
            "PERSON_ID" => $personId,
            "CREATE_DATE" => $createDate,
            "EXPIRE_DATE" => $expireDate
        ]);

        return ['token'=>$token, 'createDate'=>$createDate, 'expireDate'=>$expireDate];
    }

    return null;
}
function getAuthorizationErrorResponse() {
    $response = [];
    $response["errorMessage"] = "Authorization failed.";
    http_response_code(401);

    return json_encode($response, JSON_NUMERIC_CHECK);
}
?>