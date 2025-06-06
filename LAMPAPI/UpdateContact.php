<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

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
if (!validateUpdateData($inData)) {
	return;
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
//$conn = new mysqli("localhost", "root", "", "myweb");
if ($conn->connect_error) {
	// http_response_code(500);
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
		// http_response_code(409);
		return returnWithError("Duplicate contact exists.");
	}

	$stmtz = $conn->prepare("SELECT * FROM Contacts WHERE UserId = ? AND FirstName = ? AND LastName = ? AND Phone = ? AND Email = ?;");
	$stmtz->bind_param("issss", $userId, $oldFirstName, $oldLastName, $oldPhone, $oldEmail);
	$stmtz->execute();
	$resultz = $stmtz->get_result();

	if($row_Data = $resultz->fetch_assoc()){
		// do nothing.
	} else {
		return returnWithError("no row found");
	}
	$target_Id = $row_Data['ID'];
	$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ? ");
	$stmt->bind_param("ssssi", $newFirstName, $newLastName, $newPhone, $newEmail, $target_Id);
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

function validateUpdateData($requestData) {
	$newFirstName = $requestData["nfirstname"];
	if (!isValidInput($newFirstName)) {
		returnWithError('A contact needs a first name.');
		return false;
	}
	$newEmail = $requestData["nemail"];
	if (isValidInput($newEmail) && !isValidEmail($newEmail)) {
		returnWithError('Invalid Email: ' . $newEmail);
		return false;
	}
	$newPhone = $requestData["nphone"];
	if (isValidInput($newPhone) && !isValidPhone($newPhone)) {
		returnWithError('Invalid Phone number: ' . $newPhone);
		return false;
	}
	return true;
}

?>
