<?php

$inputData = getRequestInfo();

$userId = $inputData['userid'];
$limit = $inputData['limit'];
$offset = $inputData['offset'];

$search = isset($inputData['searchstring']) ? "%" . $inputData['searchstring'] . "%" : "%";

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
	// http_response_code(500);
	returnWithError($conn->connect_error);
} else {
    // Performs multifield search against contacts of current user
	$stmt = $conn->prepare("
	SELECT * FROM Contacts 
	WHERE UserId = ? AND (
		FirstName LIKE ? OR
		LastName LIKE ? OR
		Phone LIKE ? OR
		Email LIKE ? OR
		CONCAT(FirstName, ' ', LastName) LIKE ?
	) ORDER BY FirstName, LastName LIMIT ? OFFSET ? ");
    $stmt->bind_param("isssssii", $userId, $search, $search, $search, $search, $search, $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();

    $stmtz = $conn->prepare("
	SELECT COUNT(*) AS total_count FROM Contacts 
	WHERE UserId = ? AND (
		FirstName LIKE ? OR
		LastName LIKE ? OR
		Phone LIKE ? OR
		Email LIKE ? OR
		CONCAT(FirstName, ' ', LastName) LIKE ?
	) ORDER BY FirstName, LastName ");
    $stmtz->bind_param("isssss", $userId, $search, $search, $search, $search, $search);
    $stmtz->execute();
    $resultz = $stmtz->get_result();
	
    if ($result->num_rows > 0) {
		$contacts = $result->fetch_all(MYSQLI_ASSOC);
		$total = $resultz->fetch_all(MYSQLI_ASSOC);
		$retValue = json_encode(["error" => false, "contacts" => $contacts, "total" => $total]);
		sendResultInfoAsJson($retValue);
	} else {
		// http_response_code(400);
		$retValue = json_encode(["error"=> true, "error_message" => "No records found."]);
		sendResultInfoAsJson($retValue);
	}
	
	$stmt->close();
	$conn->close();
}

function getKey($arr, $key) {
    if (array_key_exists($key, $arr)) {
        return $arr[$key] . '%';
    } else {
        return '%';
    }
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


function returnWithError( $err )
{
	$retValue = '{"error": true, "error_message": ' . $err . '"}';
	sendResultInfoAsJson( $retValue );
}
function returnWithInfo($firstName, $lastName, $id)
{
	$retValue = '{"error": false, "id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
	sendResultInfoAsJson($retValue);
}
?>
