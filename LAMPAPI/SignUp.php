
<?php

	$inData = getRequestInfo();	// get input.
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); // connect to database.	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT 1 FROM Users WHERE Login=?");	// mysql statement to search if user exists
		$stmt->bind_param("s", $inData["login"]);	
		$stmt->execute();
		$result = $stmt->get_result();

		if( mysqli_num_rows($result) < 1) // new user
		{
			$istmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?) ");	// mysql statement to add new user record.
	    	$istmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
            $istmt->execute();
		    $iresult = $istmt->get_result();
            if(mysqli_stmt_execute($istmt)){
				returnwithInfo($inData["firstname"], $inData["lastname"], $inData["login"]);	// return with info of new added user.
            } else {
                returnWithError(mysqli_stmt_error($istmt)); 
            }
			$istmt->close();
		}
		else
		{
			returnWithError("User already exists");
		}
		
		$stmt->close();
		$conn->close();
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
		$retValue = '{"error":"' . $err . '","flag":1}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $slogin )
	{ 
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","login":"' . $slogin . '","error":"","flag":0}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
