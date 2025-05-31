<?php
include("inputValidation.php");

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
if (!checkIsValid($inData, "nfirstname")) {
	return;
}
if (!checkIsValid($inData, "nlastname")) {
	return;
}
if (!checkIsValid($inData, "nphone")) {
	return;
}
if (!checkIsValid($inData, "nemail")) {
	return;
}

if (!isValidPhone($newPhone)){ 
	return returnWithError("Invalid phone format.");
}
if (!isValidEmail($newEmail)){ 
	return returnWithError("Invalid email format.");
}


$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
//$conn = new mysqli("localhost", "root", "", "myweb");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
	// check if updaing values creates a duplicate entry
	$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserId = ? AND FirstName = ? AND LastName = ? AND Phone = ? AND Email = ?;");
	$stmt->bind_param("issss", $userId, $newFirstName, $newLastName, $newPhone, $newEmail);
	$stmt->execute();

	$result = $stmt->get_result();
	if ($result->num_rows > 0) {
		$stmt->close();
		$conn->close();
		return returnWithError("Duplicate contact exists.");
	}

	$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE UserId = ? AND FirstName = ? AND LastName = ? AND Phone = ? AND Email = ? ");
	$stmt->bind_param("ssssissss", $newFirstName, $newLastName, $newPhone, $newEmail, $userId, $oldFirstName, $oldLastName, $oldPhone, $oldEmail);
	$stmt->execute();
	$stmt->close();
	$conn->close();
	returnWithSuccess();
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err)
{
	$retValue = json_encode(["error"=>true, "error_message"=>$err]);
	sendResultInfoAsJson($retValue);
}
function returnWithSuccess() {
	$retValue = json_encode(["error"=>false]);
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

?>