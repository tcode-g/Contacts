
let firstNameIsValid = false;
let lastNameIsValid = false;
let userNameIsValid = false;
let passwordIsValid = false;
let phoneIsValid = false;
let emailIsValid = false;

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
            if(id == "signupFirstName" || id == "first" || id == "iData1"){
                firstNameIsValid = true;
            } else {
                lastNameIsValid = true;
            }
        } else if(currentLength > 30) {
            if(id == "signupFirstName" || id == "first"){
                firstNameIsValid = false;
            } else {
                lastNameIsValid = false;
            }
            let tempStr = element.value.slice(0, -1);
            element.value = element.value.replace(/./g, "");
            element.value = tempStr;
            if(id == "signupFirstName"){
                document.getElementById("signUpFnameMsg").innerHTML = "max char count";
            } else if(id == "signupLastName")  {
                document.getElementById("signUpLnameMsg").innerHtml = "max char count";
            }
        } else {
            if(id == "signupFirstName"){
                document.getElementById("signUpFnameMsg").innerHTML = "";
            } else if(id == "signupLastName")  {
                document.getElementById("signUpLnameMsg").innerHtml = "";
            }
            if(id == "signupFirstName" || id == "first" || id == "iData1"){
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


function validatePhone(id)
{
    let element = document.getElementById(id);
    element.value = element.value.replace(/[^0-9-]/g, "");
    let currentLength = element.value.length;
    let tempStr = element.value;
    tempStr = tempStr.replace(/[^0-9]/g, "");
    let numLength = tempStr.length;
    console.log(currentLength + " " + numLength);
    if(numLength < 10){
        phoneIsValid = false;
        if(element.value.charAt(currentLength - 1) == "-"){
            if(currentLength == 4 || currentLength == 8){
                // do nothing
            } else {
                let tempStr = element.value.slice(0, -1);
                element.value = element.value.replace(/./g, "");
                element.value = tempStr;
            }
        }
    } else if(numLength > 10){
        phoneIsValid = false;
        let tempStr = element.value.slice(0, -1);
        element.value = element.value.replace(/./g, "");
        element.value = tempStr;
    } else {
        phoneIsValid = true;
    }
}

function sanitizePhone(id)
{
    if(!phoneIsValid){
        return;
    }

    let element = document.getElementById(id);
    element.value = element.value.replace(/[^0-9]/g, "");
}

function displayPhone(str)
{
    let index = 0;
    str = str.replace(/[^0-9]/g, "");
    if(str.length != 10){
        return str;
    }
    let baseStr = "000-000-0000".split('');
    for(let x = 0; x < 12; x++){
        if(x == 3 || x == 7){
            // do nothing.
        } else {
            baseStr[x] = str.charAt(index++);
        }
    }
    return baseStr.join("");
}

function validateEmail(id)
{
    let element = document.getElementById(id);
    element.value = element.value.replace(/[ ]/g, "");
    let currentLength = element.value.length;
    if(currentLength < 3){
        emailIsValid = false;
    } else {
        if(/[a-zA-Z0-9.!#$%^&*_?=]+@[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}/g.test(element.value)){
            emailIsValid = true;
        } else {
            emailIsValid = false;
        }
    }
}


/** 
 * Checks that all form fields have acceptable content in them
 * If any isValid has a non-truthy value, it will return false
 * Otherwise, return true
 */
function checkSignUpForm() {
    return firstNameIsValid && lastNameIsValid && userNameIsValid && passwordIsValid;
}

function checkContactForm() {
    if(!firstNameIsValid){
        document.getElementById("first").classList.add("invalid");
    } else {
       document.getElementById("first").classList.remove("invalid"); 
    }
    if(!lastNameIsValid){
        document.getElementById("last").classList.add("invalid");
    } else {
        document.getElementById("last").classList.remove("invalid"); 
    }
    if(!emailIsValid){
        document.getElementById("email").classList.add("invalid");
    } else {
       document.getElementById("email").classList.remove("invalid"); 
    }
    if(!phoneIsValid){
        document.getElementById("phone").classList.add("invalid");
    } else {
        sanitizePhone("phone");
        document.getElementById("phone").classList.remove("invalid"); 
    }
    return firstNameIsValid && lastNameIsValid && phoneIsValid && emailIsValid;
}

function checkEditContact()
{
    validateName("iData1");
    validateName("iData2");
    validatePhone("iData3");
    validateEmail("iData4");
        
    
    if(!firstNameIsValid){
        document.getElementById("iData1").classList.add("invalid");
    } else {
       document.getElementById("iData1").classList.remove("invalid"); 
    }
    if(!lastNameIsValid){
        document.getElementById("iData2").classList.add("invalid");
    } else {
        document.getElementById("iData2").classList.remove("invalid"); 
    }
    if(!emailIsValid){
        document.getElementById("iData4").classList.add("invalid");
    } else {
       document.getElementById("iData4").classList.remove("invalid"); 
    }
    if(!phoneIsValid){
        document.getElementById("iData3").classList.add("invalid");
    } else {
        sanitizePhone("iData3");
        document.getElementById("iData3").classList.remove("invalid"); 
    }
    console.log(firstNameIsValid + " " + lastNameIsValid + " " + emailIsValid + " " + phoneIsValid);
    return firstNameIsValid && lastNameIsValid && phoneIsValid && emailIsValid;
}
