<?php

$inputData = getRequestInfo();

$userId = $inputData['userid'];
$contactId = $inputData['id'];

# check if both userId and contactId are numeric with is_numeric()

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserId = ?;");
    $stmt->bind_param("ii", $contactId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    if (mysqli_affected_rows($conn) > 0) {
        returnWithSuccess();
    } else {
        // $retVal = json_encode(["error" => true, "error_message" => "Contact not found."]);
        // returnWithError("Contact not found");
        returnWithError("Contact not found.");

    }

    $stmt->close();
	$conn->close();
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
    $retValue = json_encode(["error"=>true, "error_message" => $err]);
    sendResultInfoAsJson( $retValue );
}
?>