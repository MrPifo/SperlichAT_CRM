<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: token, Content-Type');
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
include "../database.php";
use Dcblogdev\PdoWrapper\Database;

$db_main_user = "h30u221";
$db_main_pass = "Lion&Nino2025";
$db_main_name = "h30u221_crm";
$db_main_host = "mysql80a.ssl-net.net";
$db = new Database([
	"username" => $db_main_user,
	"database" => $db_main_name,
	"password" => $db_main_pass,
	"host" => $db_main_host,
	"type" => "mysql",
	"charset" => "utf8mb4"
]);

$db->raw("SET NAMES 'utf8mb4'");
$db->raw("SET CHARACTER SET utf8mb4");
$db->raw("SET character_set_connection=utf8mb4");

// Cannot be used with Multipart-Enctype data
function getPost() {
	return json_decode(file_get_contents("php://input"), true);
}
function getDB() {
	return $GLOBALS["db"];
}
/*function isLoggedIn($token) {
	if(empty($token) == true) {
		$token = getPost()["token"];
	}

	if (isset($token) && empty($token) == false) {
		getDB()->run("DELETE FROM Session WHERE CREATETIME < (NOW() - INTERVAL 48 HOUR)");
		$row = getDB()->row("SELECT COUNT(*) AS Amount FROM Session WHERE TOKENID = :token", ['token' => $token]);

		if ($row->Amount == 1) {
			return true;
		} else {
			return false;
		}
	}
	
	return false;
}*/