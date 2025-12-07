<?php
    function getBody() {
        $body = json_decode(file_get_contents('php://input'), true);

        return $body;
    }
    function getResponse($status, $data = null, $message = '') {
        return json_encode([
            'status' => $status,
            'data' => $data,
            'message' => $message
        ]);
    }
    function getPersonIdByUser($userId) {
        $row = getDB()->row("
            SELECT PERSON_ID
            FROM USER
            WHERE USERID = :user
            LIMIT 1
        ", ['user' => $userId]);

        if(empty($row) == false) {
            return $row->PERSON_ID;
        }

        return null;
    }
?>