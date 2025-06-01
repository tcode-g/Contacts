<?php

function isValidPhone($input) {
    return preg_match('/^\d{7,17}$/', $input) === 1;
}
function isValidEmail($email)
{
    $result = preg_match("/^\w+@\w+\.[A-z]{2,4}$/", $email);
    return $result ? true : false;
}
function isValidUsername($username)
{
    $userFlag = 0;
    $userFlag += preg_match_all('/\s/', subject: $username); # any space
    $userFlag += preg_match_all('/^$/', $username); #empty string

    return $userFlag == 0 && isSafeForSQL(input: $username);
}
function isValidPassword($password)
{
    $passFlag = 0;
    $passFlag += preg_match('/\s/', $password);
    // $passFlag += preg_match('/^$/', $password);
    $passFlag += isEmpty($password) ? 1 : 0;

    return $passFlag == 0 && isSafeForSQL($password);
}
function isValidInput($input) {
    $errorFlag = 0;
    $errorFlag += isEmpty($input) ? 1 : 0;
    $errorFlag += preg_match('/\s/', $input);

    return $errorFlag == 0 && isSafeForSQL($input);
}
function isSafeForSQL($input)
{
    $result = preg_match("/(;|,|\"|')+/", $input);
    return $result ? false : true;
}

function isEmpty($input) {
    return strlen(trim($input)) == 0;
}

// function getRequestInfo()
// {
//     return json_decode(file_get_contents('php://input'), true);
// }
// function returnJSON($data)
// {
//     header('Content-type: application/json');
//     echo $data;
// }

// $inputData = getRequestInfo();

// $phone = $inputData["phone"];
// $email = $inputData["email"];
// $sqlInput = $inputData["input"];

// $resArray = [
//     "validPhone" => isValidPhone($phone),
//     "validEmail" => isValidEmail($email),
//     "validForSQL" => isSafeForSQL($sqlInput),
//     "phone" => $phone,
//     "email" => $email
// ];

// returnJSON(json_encode($resArray));


?>