
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
        document.getElementById("signUpPasswordMsg1").innerHTML = "Passwod should be between 8 and 54 characters!";
    } else {
        document.getElementById("signUpPasswordMsg1").innerHTML = "";
        tempInt += 1;
    }

    if(/[0-9]/g.test(element.value) && /\w/g.test(element.value)){
        document.getElementById("signUpPasswordMsg2").innerHTML = "";
        tempInt += 1;
    } else {
        document.getElementById("signUpPasswordMsg2").innerHTML = "Pasword should have at least one digit!";
    }

    if(/[A-Z]/g.test(element.value) && /[a-z]/g.test(element.value)){
        document.getElementById("signUpPasswordMsg3").innerHTML = "";
        tempInt += 1;
    } else {
        document.getElementById("signUpPasswordMsg3").innerHTML = "At least one uppercase and one lowercase character!";
    }
    

    if(/[^a-zA-Z0-9 ]/g.test(element.value) ){
        document.getElementById("signUpPasswordMsg4").innerHTML = "";
        tempInt += 1;
    } else {
        document.getElementById("signUpPasswordMsg4").innerHTML = "Password should have at least one special character!";
    }
    if(tempInt == 4){
        passwordIsValid = true;
    } else {
        passwordIsValid = false;
    }
}

function checkUsername(){
    if(!userNameIsValid){
        return;
    }

    let loginD = document.getElementById("signupUserName").value;
    let tmp = { login: loginD};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/checkUsers.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);
                if(jsonObject.UserIsFound)
                {
                    userNameIsValid = false;
                    document.getElementById("signUpUnameMsg").innerHTML = "Username already exists";
                }			

			}
		};
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		console.log(err.message);
	}
}

function checkSignUpForm(){
    return firstNameIsValid && lastNameIsValid && userNameIsValid && passwordIsValid;
}
