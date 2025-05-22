<?php
	$inData = getRequestInfo();
	
	$oldFirstName = $inData["firstname"];
	$oldLastName = $inData["lastname"];
	$oldPhone = $inData["phone"];
	$oldEmail = $inData["email"];
	$userId = $inData["userid"];
  $newFirstName = $inData["firstname"];
	$newLastName = $inData["lastname"];
	$newPhone = $inData["phone"];
	$newEmail = $inData["email"];

	//$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    $conn = new mysqli("localhost", "root", "", "myweb");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE FirstName = ? AND LastName = ? AND Phone = ? AND Email = ? AND UserId = ? ");
		$stmt->bind_param("sssssssss",$newFirstName, $newLastName, $newPhone, $newEmail, $userId, $oldFirstName, $oldLastName, $oldPhone, $oldEmail);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
