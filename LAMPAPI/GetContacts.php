<?php

$inData = getRequestInfo();

$userId = $inData["UserId"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
	$stmt = $conn->prepare("SELECT * from Contacts WHERE UserId = ?");
	$stmt->bind_param("i", $userId);
	$stmt->execute();
	$result = $stmt->get_result();

	if ($result->num_rows > 0) {
		$contacts = $result->fetch_all(MYSQLI_ASSOC);
		$retValue = json_encode(["error" => false, "contacts" => $contacts]);
		sendResultInfoAsJson($retValue);
	} else {
		$retValue = json_encode(["error"=> true, "error_message" => "No records found."]);
		sendResultInfoAsJson($retValue);
		// returnWithError("No Records Found");
	}

	$stmt->close();
	$conn->close();
}

function getRequestInfo()
{
	// return json_decode(file_get_contents('php://input'), true);
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