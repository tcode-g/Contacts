<?php

$inputData = getRequestInfo();

$userId = $inputData['userid'];
$contactId = $inputData['id'];


# optional fields to change, though at least one must be provided
$changedFields = 0;
$firstName = getKeyIfIncluded(key: "firstname");
$lastName = getKeyIfIncluded(key: "lastname");
$phone = getKeyIfIncluded(key: "phone");
$email = getKeyIfIncluded(key: "email");

if ($changedFields == 0) {
    returnWithError("One field (firstname, lastname, phone, email) must be provided.");
    return;
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("UPDATE Contacts SET {$firstName}{$lastName}{$phone}{$email} WHERE ID = ? AND UserId = ?;");
    $stmt->bind_param("ii", $contactId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    if (mysqli_affected_rows($conn) > 0)
     {
        returnWithSuccess();
    } else {
        // $retVal = json_encode(["error" => true, "error_message" => "Contact not found."]);
        returnWithError("Contact not found.");

        // returnWithError("Contact not found");
    }

    $stmt->close();
	$conn->close();
}

function getKeyIfIncluded($key) {
    global $inputData, $changedFields;
    if (array_key_exists($key, $inputData)) {
        $changedFields++;
        // $uppercaseKey = ucwords($key);
        return "{$key} = '{$inputData[$key]}' ";
    }
    return "";
}
function getRequestInfo()
{
	// return json_decode(file_get_contents('php://input'), true);
	return json_decode(file_get_contents('php://input'), true);	
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}
function returnWithSuccess() {
    $retVal = json_encode(["error" => false]);
    sendResultInfoAsJson($retVal);

}
function returnWithError( $err )
{
    // $retValue = '{"error":"' . $err . '","flag":1}';
    $retValue = json_encode(["error" => true, "error_message" => $err]);
    sendResultInfoAsJson( $retValue );
}
?>