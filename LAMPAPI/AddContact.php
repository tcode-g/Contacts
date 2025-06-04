<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstname"];
	$lastName = $inData["lastname"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $inData["userid"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

	if ($conn->connect_error) 
	{
		// http_response_code(500);
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Check if contact already exists for this user
		$checkStmt = $conn->prepare("
		SELECT ID FROM Contacts 
		WHERE UserId = ? AND
		FirstName = ? AND 
		LastName = ? AND 
		Phone = ? AND
		Email = ?");
		$checkStmt->bind_param("issss", $userId, $firstName, $lastName, $phone, $email);
		$checkStmt->execute();
		$checkStmt->store_result();

		if ($checkStmt->num_rows > 0) {
			// contact already exists, insertion is omitted
			$checkStmt->close();
			$conn->close();
			// http_response_code(409);
			returnWithError("Contact Already Exists");
		} else {
			$checkStmt->close();
			// contact doesn't exist and is inserted
			$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email,  UserId) VALUES(?,?,?,?,?)");
			$stmt->bind_param("ssssi",$firstName, $lastName, $phone, $email, $userId);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithSuccess();
		}
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
	
	function returnWithSuccess() {
		$retValue = '{"error": false}';
		sendResultInfoAsJson($retValue);
	}
	function returnWithError( $err )
	{
		$retValue = '{"error":" true, "error_message": ' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
