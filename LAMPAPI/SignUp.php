<?php

include("inputValidation.php");

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err, $other)
{	
	$resArr = ["error" => true, "error_message"=> $err];
	if ($other) {
		array_combine($resArr, $other);
	$retValue = json_encode($resArr);
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $slogin)
{
	// $retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","lastName":"' . $slogin . '","error":"","flag":0}';
	$retValue = json_encode(["error"=>false, "flag" => 0, "firstName"=> $firstName,"lastName"=> $lastName,"login"=> $slogin]);
	sendResultInfoAsJson($retValue);
}

function checkIsValid($arr, $key) {
	$value = $arr[$key];
	if (!isValidInput($value)) {
		returnWithError('Invalid ' . $key);
		return false;
	}

	return true;
}

try {

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) {
		returnWithError($conn->connect_error);
	} else {

		// # username input validation
		// $username = $inData['login'];
		// if (!isValidInput($username)) {
		// 	returnWithError('Invalid username');
		// 	return;
		// }

		// # password input validation
		// $password = $inData['password'];
		// if (!isValidInput($password)) {
		// 	password:
		// 	returnWithError('Invalid password');
		// 	return;
		// }

		// $firstName = $inData['firstname'];

		// $lastName = $inData['lastname'];

		if (!checkIsValid($inData, "login")) {
			return;
		}
		if (!checkIsValid($inData, "password")) {
			return;
		}
		if (!checkIsValid($inData, "firstname")) {
			return;
		}
		if (!checkIsValid($inData, "lastname")) {
			return;
		}


		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?) ");
		$stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
		$stmt->execute();
		returnwithInfo($inData["firstname"], $inData["lastname"], $inData["login"]);
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
		returnWithError("User already exists.", ["flag" => 1]);
	}	
?>