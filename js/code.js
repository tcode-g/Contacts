// const urlBase = 'http://localhost/myprojectlocal/LAMPAPI'
const urlBase = "http://" + window.location.hostname + "/LAMPAPI";
const extension = 'php';
const limit = 10;

let userId = 0;
let firstName = "";
let lastName = "";
let isRunning = false;
let eFlag = 0;
let jData = [];
let currentOffset = 0;

function getKey(e)
{
    if (e.key === "Enter") 
	{
        const signupDiv = document.getElementById("signupDiv");
        if (signupDiv.style.display !== "none") 
		{
            signup();
        } else 
		{
            doLogin();
        }
    }
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	if(login.length < 1 && password.length < 1){
		document.getElementById("loginResult").innerHTML = "Missing input fields";
		return;
	} else if (login.length < 1) {
		document.getElementById("loginResult").innerHTML = "Missing 'Username' field.";
		return;
	} else if (password.length < 1) {
		document.getElementById("loginResult").innerHTML = "Missing 'Password' field";
		return;
	} 
	
	var hash = md5(password);

	document.getElementById("loginResult").innerHTML = "";

	var tmp = { login: login, password: hash };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

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
				console.log("Response for login attempt: ", jsonObject);

				let err = jsonObject.error;

				if (err) {
					document.getElementById("loginResult").textContent = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		console.log("Sending login attempt: ", jsonPayload);
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function signup()
{
	if (isRunning) {
		return;
	}

	if(!checkSignUpForm()){
		document.getElementById("signUpResult").innerHTML = "invalid data";
		return;
	} 
	
	isRunning = true;
	let newFirstName = document.getElementById("signupFirstName").value;
	let newLastName = document.getElementById("signupLastName").value;
	let newLogin = document.getElementById("signupUserName").value;
	let newPassword = document.getElementById("signupNewPassword").value;
	var hash = md5(newPassword);
	document.getElementById("loginResult").innerHTML = "";

	var tmp = { firstname: newFirstName, lastname: newLastName, login: newLogin, password: hash };
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/SignUp.' + extension;
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
				let eFlag = jsonObject.flag;
				console.log("Reponse for signup attempt: ", jsonObject);
				if (eFlag > 0 || jsonObject.error)
				{
					document.getElementById("signUpResult").innerHTML = "User already exists";
					return;
				}
				else {
					document.getElementById("loginResult").innerHTML = "User created";
					toggleAuth('login');
				}
			}
		};
		console.log("eFlag upon sending request: ", eFlag);
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("signUpResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0)
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = { color: newColor, userId, userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddColor.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	let colorList = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchColors.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);

				for (let i = 0; i < jsonObject.results.length; i++)
				{
					colorList += jsonObject.results[i];
					if (i < jsonObject.results.length - 1)
					{
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

// Changes Auth window between login and signup
function toggleAuth(mode)
{
	document.getElementById('loginDiv').style.display = (mode === 'login') ? 'block' : 'none';
	document.getElementById('signupDiv').style.display = (mode === 'signup') ? 'block' : 'none';
	if(mode == 'signup'){
		document.getElementById("signupFirstName").addEventListener('input', function() {validateName("signupFirstName"); }, false);
		document.getElementById("signupLastName").addEventListener('input', function() {validateName("signupLastName"); }, false);
		document.getElementById("signupUserName").addEventListener('input', function() {validateUserName("signupUserName"); }, false);
		document.getElementById("signupNewPassword").addEventListener('input', function() {validatePassword("signupNewPassword"); }, false);
		document.getElementById("signupUserName").addEventListener('blur', function() {checkUsername("signupUserName"); }, false);
	}
}

//logic for contact list page
function getAllContacts(dOffset)
{
	console.log("Getting all contacts");
	document.getElementById("search").addEventListener('input', function() { search(currentOffset, true); }, false);
	let tmp = {UserId:userId, limit:limit, offset:dOffset};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/GetContacts.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				console.log("Get all contacts response: ", jsonObject);
				jData = jsonObject.contacts;
				if (jData) {
					console.log("Generating populated table");
					generateTable(jData, dOffset, jsonObject.total[0].total_count, "getAllContacts");					
				} else {
					console.log("Generating empty table");
					generateTable([], dOffset, 0, "getAllContacts");
				}
			
			};
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Error caught: ", err);
	}
}

function loadContactForm()
{
    let element = document.getElementById("addContact");

    // Case where the form is already loaded
    if (document.getElementById("sub"))
    {
        return;
    }


    let form = `<div class="formRow">
                    <input type="text" id="first" class="formInput" placeholder="First Name" name="firstName" />
                    <input type="text" id="last" class="formInput" placeholder="Last Name" name="lastName" />
                    <input type="text" id="phone" class="formInput" placeholder="XXX-XXX-XXXX" name="phone" />
                    <input type="text" id="email" class="formInput" placeholder="username@email.com" name="email" />
                  </div>

                <button type="button" id="sub" class="buttons">Submit</button>`;

        
    element.insertAdjacentHTML("beforeend", form);

    document.getElementById("sub").addEventListener('click', function(){ addNewContact(); }, false);
    
}

function addNewContact()
{
    //e.preventDefault();
    let firstName = document.getElementById("first").value;
    let lastName = document.getElementById("last").value;
    let zPhone = document.getElementById("phone").value;
    let zEmail = document.getElementById("email").value;

    let tmp = {firstname:firstName, 
               lastname:lastName, 
               phone:zPhone, 
               email:zEmail, 
               userid:userId};
    let jsonPayload = JSON.stringify( tmp );

    console.log("Adding contact: ", jsonPayload);

    let url = urlBase + '/AddContact.' + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
				let jsonObject = JSON.parse( xhr.responseText );
				console.log("Successfully contact response: ", jsonObject);
                // Clear input fields
                document.getElementById("first").value = "";
                document.getElementById("last").value = "";
                document.getElementById("phone").value = "";
                document.getElementById("email").value = "";

                getAllContacts(currentOffset);
            }

        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        //failed or contact already existed
    }
}

function handleTableEvent(e)
{
	if(e.target.classList.contains("edit_button")){
		console.log("suppap");
	//	console.log(e);

		updateContact(e.target.closest("tr"));
	} else if(e.target.classList.contains("del_button")){
		// getIdToDelete(e.target.closest("tr"));
		let hiddenContactIdElement = e.target.parentElement.parentElement;
		let contactId = hiddenContactIdElement.getAttribute("contactid");
		// double check the user wants to delete this contact entry
		if (confirm("Are you sure you want to delete this contact?")) {
			deleteContact(contactId);
		}
	}
}

function updateContact(row){
	console.log("Row being updated: ", row);
	console.log(row instanceof HTMLTableRowElement);
	let oldData1 = row.cells[0].innerText;
	let oldData2 = row.cells[1].innerText;
	let oldData3 = row.cells[2].innerText;
	let oldData4 = row.cells[3].innerText;
	
	row.cells[0].innerHTML = `<input type="text" id="iData1" class="update_text" value="${oldData1}" size="${oldData1.length + 10}" name="firstName"/>`;
	row.cells[1].innerHTML = `<input type="text" id="iData2" class="update_text" value="${oldData2}" size="${oldData2.length + 10}" name="lastName"/>`;
	row.cells[2].innerHTML = `<input type="text" id="iData3" class="update_text" value="${oldData3}" size="${oldData3.length + 10}" name="phone"/>`;
	row.cells[3].innerHTML = `<input type="text" id="iData4" class="update_text" value="${oldData4}" size="${oldData4.length + 10}" name="email"/>`;
	row.cells[4].innerHTML = `<button type="button" id="confirm" class="confirm_button" >Confirm</button>
								<button type="button" id="cancel" class="cancel_button" >Cancel</button>`;
	let confirmButton = row.querySelector("#confirm"); 
	confirmButton.addEventListener('click', () => editContact(row, oldData1, oldData2, oldData3, oldData4), false);

	let cancelButton = row.querySelector("#cancel");
	cancelButton.addEventListener('click', () => getAllContacts(currentOffset) , false);
	// document.getElementById("confirm").addEventListener('click', function () { editContact(oldData1, oldData2, oldData3, oldData4); }, false);
	// document.getElementById("cancel").addEventListener('click', function () { getAllContacts(currentOffset) }, false);
	//${jData[row].FirstName}
}

function displayUpdateError(msg, msFade) {
	let el = document.getElementById("updateErrorMsg");
	el.textContent = msg;
	el.classList.remove("hidden");
	setTimeout(() => {
        el.classList.add("hidden"); // Start fade out
    }, duration);

    // Optional: fully hide the element after fade
    setTimeout(() => {
        el.style.display = "none";
    }, duration + 1000); // 1s = fade duration
}

function editContact(row, data1, data2, data3, data4) {
	let data5 = row.querySelector("#iData1").value;
	let data6 = row.querySelector("#iData2").value;
	let data7 = row.querySelector("#iData3").value;
	let data8 = row.querySelector("#iData4").value;
	let tmp = { ofirstname: data1, olastname: data2, ophone: data3, oemail: data4, userid: userId, nfirstname: data5, nlastname: data6, nphone: data7, nemail: data8 };
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//successful
				console.log("update req resp: ", xhr.responseText);
				let jsonObject = JSON.parse( xhr.responseText );
				console.log("Update object response: ", jsonObject);
				if (jsonObject.error) {
					displayUpdateError(jsonObject.error_message, 5000);
				}
				getAllContacts(currentOffset); //update table
			}
		};
		console.log("Sending update contact payload: ", jsonPayload);
		xhr.send(jsonPayload);
	}
	catch (err) {
		//failed
	}
	
}

function getIdToDelete(row)
{
	let fName = row.cells[0].innerText;
	let lName = row.cells[1].innerText;
	let tmp = {userid: userId, firstname: fName, lastname: lName};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/SearchContacts.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//successful
				let jsonObject = JSON.parse( xhr.responseText );
				console.log("watch");
				console.log(jsonObject);
				if(jsonObject.contacts.length > 0)
				{
					let data = jsonObject.contacts;
					deleteContact(data[0].ID);
				} 

				
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		//failed
	}

}

/**
 * Searches the database for a match of the search string.
 * 
 * Generates table
 */
function search(dOffset, resetOffset)
{
	if(resetOffset){
		dOffset = 0;
	}
	
	let searchString = document.getElementById("search").value;
	
	let tmp = {userid: userId, 
		       searchstring: searchString, limit:limit, offset:dOffset};
	let jsonPayload = JSON.stringify(tmp);
	console.log("Searching: ", jsonPayload);
	let url = urlBase + '/SearchContacts.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//successful
				let jsonObject = JSON.parse( xhr.responseText );
				console.log("Successful lookup: ", jsonObject);
				let data = [];
				let total_count = 0;
				if(!jsonObject.error)
				{
					data = jsonObject.contacts;
					if(jsonObject.total[0]?.total_count){
						total_count = jsonObject.total[0].total_count;
					}
				}
				generateTable(data, dOffset, total_count, "search");
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		//failed
	}
}
function deleteContact(contactId) 
{
	
	let tmp = {userid: userId, id: contactId };
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/DeleteContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//successful
				console.log("Successfully deleted contact: ", contactId);
				let jsonObject = JSON.parse( xhr.responseText );
				console.log("Response from delete attempt: ", jsonObject);
				getAllContacts(currentOffset);
			}
		};
		console.log("Sending Delete contact payload: ", jsonPayload);
		xhr.send(jsonPayload);
	}
	catch (err) {
		//failed
	}
}
function generateTable(jData, offset, count, caller)
{
	console.log("GenerateTable called");
	console.log("jdata: ", jData);
	console.log("offset: ", offset);
	console.log("count: ", count);
	console.log("caller: ", caller);

	let temp = offset;
	let table = ""; 
	table += "<table id='contacts' border='2' cellspacing='1' cellpadding='8' class='table'>";
	table += "<tr><th>FirstName</th><th>LastName</th><th>Phone</th><th>Email</th><th></th></tr>";
	
	if (jData.length == 0) {
		table += `<tr><td colspan="5" style="text-align:center;">No contacts found</td></tr>`;
	} else {
		for( let row=0; row<jData.length; row++ ) {	
			table += `<tr contactid=${jData[row].ID} >
			<td>${jData[row].FirstName}</td>
			<td>${jData[row].LastName}</td>
			<td>${jData[row].Phone}</td>
			<td>${jData[row].Email}</td>
			<td><button class="edit_button">Update</button> <button class="del_button">Delete</button></td>
			</tr>`;
		}
	}

	
	table += "</tr></table>";

	if(count == 0){
		offset = -1;
	} else {
		table += `<span class = "page-info">Showing entry ${offset + 1} to ${jData.length + temp} out of ${count} total entries<br></span>`;
		let page = offset / limit + 1;
		let pageLimit = Math.ceil(count / limit);

		if(pageLimit == 0){
			page = 1;
			pageLimit =  1;
		}
		
		if(page == 1){
			table += `<span id="pagination">
			<input type="number" id="pages" inputmode="numeric" style="width:30px" value="${page}"/>  of ${pageLimit}
			<button id="jump">Jump To</button> 
			<button id="next">Next</button>
			</span>`;
		} else if(page == pageLimit){
			table += `<span id="pagination">
			<button id="prev">Previous</button>
			<input type="number" id="pages" inputmode="numeric" style="width:30px" value="${page}"/>  of ${pageLimit}
			<button id="jump">Jump To</button> 
			</span>`;
		} else {
			table += `<span id="pagination">
			<button id="prev">Previous</button>
			<input type="number" id="pages" inputmode="numeric" style="width:30px" value="${page}"/>  of ${pageLimit}
			<button id="jump">Jump To</button> 
			<button id="next">Next</button>
			</span>`;
		}
	}

	document.getElementById("contactTable").innerHTML = table;
	let tableId = document.getElementById("contacts");
	if (count >= 1) {
		tableId.addEventListener('click', function(e) { handleTableEvent(e); }, false);
		document.getElementById("pagination").addEventListener('click', function(e) {handlePaginationEvent(e, page, pageLimit, caller); }, false);
	}
	

}

function handlePaginationEvent(e, page, pageLimit, caller)
{
	if(pageLimit == 1){
		return;
	}
	
	console.log(document.getElementById(e.target.id).value);
	console.log(e.target.value);
	console.log(pageLimit);
	let offset = 0;
	console.log(e.target.id);
	if(e.target.id == "prev" ){
		offset = (page - 1) * limit - limit;
	} else if(e.target.id =="jump"){
		let tempInput = document.getElementById("pages").value; 
		if(tempInput > pageLimit || tempInput  == 0){
			console.log("failure");
			return;
		} else {
			offset = tempInput * limit - limit;
		}
		
	} else if(e.target.id == "next"){
		offset = (page + 1) * limit - limit;
	} else {
		return;
	}
	currentOffset = offset;
	console.log(offset);
	if(caller == "getAllContacts"){
		getAllContacts(currentOffset);
	} else if (caller == "search"){
		search(currentOffset, false);
	}


}

function switchMode(mode)
{
    const addContactForm = document.getElementById('addContact');
    const searchPanel = document.getElementById('search');

    if (mode === 'add') 
	{
        addContactForm.style.display = 'flex';
        searchPanel.style.display = 'none';
    } 
	else 
	{
        addContactForm.style.display = 'none';
        searchPanel.style.display = 'block';
    }

    document.getElementById('addModeBtn').classList.toggle('active-mode', mode === 'add');
    document.getElementById('searchModeBtn').classList.toggle('active-mode', mode === 'search');
}
