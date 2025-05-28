<?php

$inputData = getRequestInfo();

$login = $inputData['login'];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
    
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Login = ? ");
    $stmt->bind_param("s", $login);
    	
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
		$retValue = json_encode(["UserIsFound" => true, "message" => "Records found."]);
		sendResultInfoAsJson($retValue);
	} else {
		$retValue = json_encode(["UserIsFound"=> false, "message" => "No records found."]);
		sendResultInfoAsJson($retValue);
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


?>
