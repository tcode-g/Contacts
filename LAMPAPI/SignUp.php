
<?php

	$inData = getRequestInfo();
	


	$conn = new mysqli("localhost", "root", "", "myweb"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT 1 FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( mysqli_num_rows($result) < 1)
		{
			$istmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?) ");
		    $istmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
            $istmt->execute();
		    $iresult = $istmt->get_result();
            if(mysqli_stmt_execute($istmt)){
				returnwithInfo($inData["firstname"], $inData["lastname"], $inData["login"]);
            } else {
                returnWithError(mysqli_stmt_error($istmt)); 
            }
			$istmt->close();
		}
		else
		{
			returnWithError("User already exist");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $slogin )
	{ 
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","lastName":"' . $slogin . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
