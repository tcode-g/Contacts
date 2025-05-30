<?php
	$inData = getRequestInfo();
	
	$oldFirstName = $inData["ofirstname"];
	$oldLastName = $inData["olastname"];
	$oldPhone = $inData["ophone"];
	$oldEmail = $inData["oemail"];
	$userId = $inData["userid"];
  $newFirstName = $inData["nfirstname"];
	$newLastName = $inData["nlastname"];
	$newPhone = $inData["nphone"];
	$newEmail = $inData["nemail"];

	// there needs to be input validation for new inputs

	// check if updaing values creates a duplicate entry
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    //$conn = new mysqli("localhost", "root", "", "myweb");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE UserId = ? AND FirstName = ? AND LastName = ? AND Phone = ? AND Email = ? ");
		$stmt->bind_param("ssssissss",$newFirstName, $newLastName, $newPhone, $newEmail, $userId, $oldFirstName, $oldLastName, $oldPhone, $oldEmail);
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
