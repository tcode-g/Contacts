
<?php
	
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

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
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","lastName":"' . $slogin . '","error":"","flag":0}';
		sendResultInfoAsJson( $retValue );
	}

	try{
		
		$inData = getRequestInfo();
	
		$conn = new mysqli("localhost", "root", "", "myweb"); 	
		if( $conn->connect_error )
		{
			returnWithError( $conn->connect_error );
		}
		else
		{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?) ");
			$stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
			$stmt->execute();
			returnwithInfo($inData["firstname"], $inData["lastname"], $inData["login"]);
			$stmt->close();
			$conn->close();
		}
	

	} catch(mysqli_sql_exception $err){
		if($err->getCode() == 1062){
			$retValue = '{"firstName":"","lastName":"","lastName":"","error":"","flag":1}';
		} else {
			$retValue = '{"firstName":"","lastName":"","lastName":"","error":"","flag":2}';
		}
		header('Content-type: application/json');
		echo $retValue;
	}	
?>
