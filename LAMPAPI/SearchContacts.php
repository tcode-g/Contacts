<?php

$inputData = getRequestInfo();

$userId = $inputData['userid'];
$firstName = getKey($inputData, 'firstname');
$lastName = getKey($inputData, 'lastname');


$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserId = ? AND (FirstName like ? AND LastName like ?);");
    $stmt->bind_param("iss", $userId, $firstName, $lastName);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
		$contacts = $result->fetch_all(MYSQLI_ASSOC);
		$retValue = json_encode(["error" => false, "contacts" => $contacts]);
		sendResultInfoAsJson($retValue);
	} else {
		$retValue = json_encode(["error"=> true, "error_message" => "No records found."]);
		sendResultInfoAsJson($retValue);
	}

	$stmt->close();
	$conn->close();
}

function getKey($arr, $key) {
    if (array_key_exists($key, $arr)) {
        return $arr[$key] . '%';
    } else {
        return '%';
    }
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