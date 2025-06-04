<?php

include("inputValidation.php");

$inData = getRequestInfo();

function checkIsValid($arr, $key) {
	$value = $arr[$key];
	if (!isValidInput($value)) {
		returnWithError('Invalid ' . $key);
		return false;
	}

	return true;
}

if (!checkIsValid($inData, "login")) {
	return;
}
if (!checkIsValid($inData, "password")) {
	return;
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	// http_response_code(500);
	returnWithError($conn->connect_error);
} else {
	$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
	$stmt->bind_param("ss", $inData["login"], $inData["password"]);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($row = $result->fetch_assoc()) {
		returnWithInfo($row['firstName'], $row['lastName'], $row['ID']);
	} else {
		// http_response_code(400 );
		returnWithError("Invalid login credentials");
	}

	$stmt->close();
	$conn->close();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err)
{
	// $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	$retValue = json_encode(["error" => true, "error_message" => $err]);
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
	$retValue = '{"error": false, "id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":false}';
	sendResultInfoAsJson($retValue);
}

?>