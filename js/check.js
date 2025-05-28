
let firstNameIsValid = false;
let lastNameIsValid = false;
let userNameIsValid = false;
let passwordIsValid = false;

function validateName(id) 
{
    let element = document.getElementById(id);
    element.value = element.value.replace(/[^a-zA-Z]/g, "");
    let currentLength = element.value.length;
    if(currentLength == 0){
        // do nothing.
    } else {   
        if(currentLength == 1)
        {
            let char = element.value.charAt(0);
            element.value = element.value.replace(char, char.toUpperCase());
            if(id == "signupFirstName"){
                firstNameIsValid = true;
            } else {
                lastNameIsValid = true;
            }
        } else if(currentLength > 30) {
            if(id == "signupFirstName"){
                firstNameIsValid = false;
            } else {
                lastNameIsValid = false;
            }
            let tempStr = element.value.slice(0, -1);
            element.value = element.value.replace(/./g, "");
            element.value = tempStr;
            if(id == "signupFirstName"){
                document.getElementById("signUpFnameMsg").innerHTML = "max char count";
            } else {
                document.getElementById("signUpLnameMsg").innerHtml = "max char count";
            }
        } else {
            document.getElementById("signUpFnameMsg").innerHTML = "";
            document.getElementById("signUpLnameMsg").innerHTML = "";
            if(id == "signupFirstName"){
                firstNameIsValid = true;
            } else {
                lastNameIsValid = true;
            }
        }
    
    }
}

function validateUserName(id){
    let element = document.getElementById(id);
    element.value = element.value.replace(/[^a-zA-Z0-9]/g, "");
    let currentLength = element.value.length;
    if(currentLength == 1)
    {
        if(/[0-9]/g.test(element.value) || /\W/g.test(element.value))
        {
            userNameIsValid = false;
            element.value = element.value.replace(/\d/g, "");
        } else {
            userNameIsValid = false;
        }
    } else if(currentLength > 15){
        userNameIsValid = false;
        let tempStr = element.value.slice(0, -1);
        element.value = element.value.replace(/./g, "");
        element.value = tempStr;
        document.getElementById("signUpUnameMsg").innerHTML = "max 15 char";
    } else if(currentLength > 3){
        userNameIsValid = true;
        document.getElementById("signUpUnameMsg").innerHTML = "";
    } else {
        document.getElementById("signUpUnameMsg").innerHTML = "username too short";
        userNameIsValid = false;
    }
    
}

function validatePassword(id){
    let element = document.getElementById(id);
    element.value = element.value.replace(/[",;"]/g, "");
    let currentLength = element.value.length;
    let tempInt = 0;
    if(currentLength < 8 || currentLength > 54 ){
        document.getElementById("signUpPasswordMsg1").innerHTML = "Passwod should be between 8 and 54 chars";
    } else {
        document.getElementById("signUpPasswordMsg1").innerHTML = "";
        tempInt += 1;
    }

    if(/[0-9]/g.test(element.value) && /\w/g.test(element.value)){
        document.getElementById("signUpPasswordMsg2").innerHTML = "";
        tempInt += 1;
    } else {
        document.getElementById("signUpPasswordMsg2").innerHTML = "Pasword should be alphanumeric";
        
    }

    if(/[^a-zA-Z0-9 ]/g.test(element.value) ){
        document.getElementById("signUpPasswordMsg3").innerHTML = "";
        tempInt += 1;
    } else {
        document.getElementById("signUpPasswordMsg3").innerHTML = "Password should have special chars";
        
    }
    if(tempInt == 3){
        passwordIsValid = true;
    } else {
        passwordIsValid = false;
    }
}

function checkSignUpForm(){
    return firstNameIsValid && lastNameIsValid && userNameIsValid && passwordIsValid;
}
