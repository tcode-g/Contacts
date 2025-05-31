<?php

$inData = getRequestInfo();

$userId = $inData["UserId"];
$limit = $inData["limit"];
$offset = $inData["offset"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
	$stmt = $conn->prepare("SELECT * from Contacts WHERE UserId = ? ORDER BY FirstName, LastName LIMIT ? OFFSET ?");
	$stmt->bind_param("iii", $userId, $limit, $offset);
	$stmt->execute();
	$result = $stmt->get_result();

	$stmtz = $conn->prepare("SELECT COUNT(*) AS total_count from Contacts WHERE UserId = ?");
	$stmtz->bind_param("i", $userId);
	$stmtz->execute();
	$resultz = $stmtz->get_result();
	if ($result->num_rows > 0) {
		$contacts = $result->fetch_all(MYSQLI_ASSOC);
		$total = $resultz->fetch_all(MYSQLI_ASSOC);
		$retValue = json_encode(["error" => false, "contacts" => $contacts, "total" => $total]);
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