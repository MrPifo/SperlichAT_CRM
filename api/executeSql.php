<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST");
require_once 'lib/dbInfo.php';
require_once 'lib/auth.php';

if (isLoggedIn()) {
    $params = json_decode(file_get_contents('php://input'), true);
    $sqlStatement = $params["sql"] ?? null;
    $returnAsMap = $params["asMap"] ?? true;
    $returnsData = false;

    if ($sqlStatement != null) {
        $sqlStatement = base64_decode($sqlStatement);
        $sqlStatement = mb_convert_encoding($sqlStatement, 'UTF-8', 'auto');
        $params["sql"] = $sqlStatement;
    }

    $dataResult = null;
    $response = [];
    $response["rows"] = [];
    $response["type"] = getSqlStatementType($sqlStatement);
    // Execute Sql-Statement
    if ($sqlStatement != null) {
        try {
            $statementType = getSqlStatementType($sqlStatement);
            switch ($statementType) {
                case "SELECT":
                    $dataResult = $db->rows($sqlStatement);
                    $returnsData = true;
                    $response["success"] = true;
                    break;
                case 'INSERT':
                case 'UPDATE':
                case 'DELETE':
                    $affectedRows = $db->run($sqlStatement);
                    $response["affectedRows"] = $affectedRows;
                    if ($statementType === 'INSERT') {
                        $response["lastInsertId"] = $db->lastInsertId();
                    }
                    $response["success"] = true;
                    break;
                default:
                    throw new Exception("Unbekannter SQL-Statement-Typ");
            }
            http_response_code(200);
        } catch (Exception $e) {
            http_response_code(400);
            $response["errorMessage"] = "Invalid SQL syntax: " . $sqlStatement;
        }
    }
    // Convert map to 2D-Array
    if ($returnsData && $returnAsMap == false) {
        $dataResult = convertToArray($dataResult);
    }
    if ($returnsData) {
        $response["rows"] = $dataResult;
    }
    // Restliche Parameter übernehmen
    foreach ($params as $key => $value) {
        if ($key == "params") {
            foreach ($value as $pKey => $pValue) {
                $response[$pKey] = $pValue;
            }
        } else {
            $response[$key] = $value;
        }
    }
    
    echo json_encode($response, JSON_NUMERIC_CHECK);
} else {
    echo getAuthorizationErrorResponse();
}

function getSqlStatementType($sql){
    $sql = trim($sql);
    $firstWord = strtoupper(explode(' ', $sql)[0]);
    return $firstWord;
}
function convertToArray($data){
    if (empty($data)) return [];
    $result = [];
    foreach ($data as $row) {
        $result[] = array_values((array)$row);
    }
    return $result;
}
