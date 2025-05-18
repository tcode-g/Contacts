
<?php
	try{
	$inData = getRequestInfo();	// get input.
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); // connect to database.	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	} else {
		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?) ");	// mysql statement to add new user record.
		$stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);	
		$stmt->execute();
		$result = $stmt->get_result();

	        if(mysqli_stmt_execute($stmt)){
			returnwithInfo($inData["firstname"], $inData["lastname"], $inData["login"]);	// return with info of new added user.
	        } else {
			returnWithError(mysqli_stmt_error($stmt)); 
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
	} catch(Exception $error) {
		header('Content-type: application/json');
		$retValue = '{"error":"'.$error->getMessage().'"};
  		echo $retValue;
	}	
?>
