
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
		// $retValue = '{"error":"' . $err . '","flag":1}';
		$retValue = json_encode(["error"=>true, "error_message" => $err]);
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $slogin )
	{ 
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","login":"' . $slogin . '","error":false,"flag":0}';
		sendResultInfoAsJson( $retValue );
	}

	try{
		
		$inData = getRequestInfo();
	
		$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
		if( $conn->connect_error )
		{
			returnWithError( $conn->connect_error );
		}
		else
		{

			# username validation
			$userFlag = 0;
			$username = $inData["login"];
            $userFlag += preg_match_all('/\s/', subject: $username); # any space
            $userFlag += preg_match_all('/^$/', $username); #empty string

            if ( $userFlag > 0) {
                returnWithError('Invalid username');
				return;
            }

			# password validation
			$passFlag = 0;
			$password = $inData['password'];
			$passFlag += preg_match_all('/^/', $password);


			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?) ");
			$stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $username, $password);
			$stmt->execute();
			returnwithInfo($inData["firstname"], $inData["lastname"], $username);
			$stmt->close();
			$conn->close();
		}
	

	} catch(mysqli_sql_exception $err){
		// if($err->getCode() == 1062){
		// 	$retValue = '{"firstName":"","lastName":"","lastName":"","error":true,"flag":1}';
		// } else {
		// 	$retValue = '{"firstName":"","lastName":"","lastName":"","error":true,"flag":2}';
		// }
		// $retValue = json_encode(["error"=>true, "message"=> $err->getMessage()]);
		// header('Content-type: application/json');
		// echo $retValue;
		returnWithError("User already exists.");
	}	
?>
