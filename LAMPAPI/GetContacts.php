<?php

$inData = getRequestInfo();

$userId = $inData["ID"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
	$stmt = $conn->prepare("SELECT * from Contacts WHERE UserId = ?");
	$stmt->bind_param("s", $userId);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0) {
		$retValue = '{items: [ '. implode($result->fetch_all()) . ']}';
		sendResultInfoAsJson($retValue);
	} else {
		// returnWithError("No Records Found");
		echo $userId;
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
	$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id)
{
	$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
	sendResultInfoAsJson($retValue);
}

?>