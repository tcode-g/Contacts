// const urlBase = 'http://COP4331-5.com/LAMPAPI';
const urlBase = "http://" + window.location.hostname + "/LAMPAPI";
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let isRunning = false;
let eFlag = 0;
let jData = [];

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5(password);

	document.getElementById("loginResult").innerHTML = "";

	// let tmp = {login:login,password:password};
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
				userId = jsonObject.id;

				if (userId < 1)
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
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
	isRunning = true;
	let newFirstName = document.getElementById("firstName").value;
	let newLastName = document.getElementById("lastName").value;
	let newLogin = document.getElementById("userName").value;
	let newPassword = document.getElementById("newPassword").value;
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
				eFlag = jsonObject.flag;

				if (eFlag > 0)
				{
					document.getElementById("signupResult").innerHTML = "User already exists";
					return;
				}
				else {
					document.getElementById("signupResult").innerHTML = "new User added";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
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
}

//logic for contact list page
function getAllContacts()
{
	console.log("fick");
	document.getElementById("search").addEventListener('input', function() { search(); }, false);
	let tmp = {UserId:userId};
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
				//document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				jData = jsonObject.contacts;
				generateTable(jData);
				console.log(jData);

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}
function loadContactForm()
{
	let element = document.getElementById("addContact");
	let form = `<input type="text" id="first" placeholder="FirstName" name="firstName"/><br />
				<input type="text" id="last" placeholder="LastName" name="lastName"/><br />
				<input type="text" id="phone" placeholder="Phone" name="phone"/><br />
				<input type="text" id="email" placeholder="Email" name="email"/><br />
				<button type="button" id="sub" class="buttons" >Submit</button>`;
	
		
	element.insertAdjacentHTML("beforeend", form);

	document.getElementById("sub").addEventListener('click', function(){ addNewContact(); }, false);
	
}

function addNewContact()
{
	//e.preventDefault();
	console.log("lol");
	let firstName = document.getElementById("first").value;
	let lastName = document.getElementById("last").value;
	let zPhone = document.getElementById("phone").value;
	let zEmail = document.getElementById("email").value;

	let tmp = {firstname:firstName, lastname:lastName, phone:zPhone, email:zEmail, userid:userId};
	let jsonPayload = JSON.stringify( tmp );
	console.log(tmp);
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
				//successful
				document.getElementById("addContact").innerHTML = "";
				getAllContacts(); //update table
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//failed
	}
}

function handleTableEvent(e)
{
	if(e.target.classList.contains("edit_button")){
		console.log("suppap");
	//	console.log(e);

		updateContact(e.target.closest("tr"));
	} else if(e.target.classList.contains("del_button")){
		getIdToDelete(e.target.closest("tr"));
	}
}

function updateContact(row){
	console.log(row);
	console.log(row instanceof HTMLTableRowElement);
	let oldData1 = row.cells[0].innerText;
	let oldData2 = row.cells[1].innerText;
	let oldData3 = row.cells[2].innerText;
	let oldData4 = row.cells[3].innerText;
	
	row.cells[0].innerHTML = `<input type="text" id="iData1" value="${oldData1}" size="${oldData1.length + 10}" name="firstName"/>`;
	row.cells[1].innerHTML = `<input type="text" id="iData2" value="${oldData2}" size="${oldData2.length + 10}" name="lastName"/>`;
	row.cells[2].innerHTML = `<input type="text" id="iData3" value="${oldData3}" size="${oldData3.length + 10}" name="phone"/>`;
	row.cells[3].innerHTML = `<input type="text" id="iData4" value="${oldData4}" size="${oldData4.length + 10}" name="email"/>`;
	row.cells[4].innerHTML = `<button type="button" id="confirm" class="confirm_button" >Confirm</button>`;
	row.cells[5].innerHTML = `<button type="button" id="cancel" class="cancel_button" >Cancel</button>`;
	document.getElementById("confirm").addEventListener('click', function () { editContact(oldData1, oldData2, oldData3, oldData4); }, false);
	document.getElementById("cancel").addEventListener('click', function () { getAllContacts() }, false);
	//${jData[row].FirstName}
}

function editContact(data1, data2, data3, data4) {
	let data5 = document.getElementById("iData1").value;
	let data6 = document.getElementById("iData2").value;
	let data7 = document.getElementById("iData3").value;
	let data8 = document.getElementById("iData4").value;
	let tmp = { ofirstname: data1, olastname: data2, ophone: data3, oemail: data4, userId: userId, nfirstname: data5, nlastname: data6, nphone: data7, nemail: data8 };
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//successful
				let jsonObject = JSON.parse( xhr.responseText );
				console.log(jsonObject);
				getAllContacts(); //update table
			}
		};
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
				if(jsonObject.contacts.length == 1)
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

function search()
{

	let string = document.getElementById("search").value;
	let arr = string.split(" ");
	
	console.log(arr.length);
	if(arr.length == 1){
		firstName = arr[0];
		lastName = "";
	} else if(arr.length == 2){
		if(arr[0] == ""){
			firstName = arr[1];
			lastName = ""
		} else if(arr[1] == ""){
			firstName = arr[0];
			lastName = "";
		} else {
			firstName = arr[0];
			lastName = arr[1];
		}	
	} else {
		firstName = "zzzzzzzz@@";
		lastName = "zzzzzzzzz@@"
	}
	console.log(firstName);
	console.log(lastName);
	let tmp = {userid: userId, firstname: firstName, lastname: lastName};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/SearchContacts.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//successful
				console.log(xhr.responseText);
				let jsonObject = JSON.parse( xhr.responseText );
				console.log("watch");
				console.log(jsonObject);
				if(jsonObject.contacts.length > 0)
				{
					let data = jsonObject.contacts;
					generateTable(data);
				} 
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
				console.log(contactId);
				console.log(xhr.responseText);
				let jsonObject = JSON.parse( xhr.responseText );
				console.log(jsonObject);
				getAllContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		//failed
	}
}
function generateTable(jData)
{
	let table = "<h2>Contact List</h2>"; 
	table += "<table id='contacts' border='2' cellspacing='1' cellpadding='8' class='table'>";
	table += "<tr><th>FirstName</th><th>LastName</th><th>Phone</th><th>Email</th><th></th><th></th></tr>";	
	for( let row=0; row<jData.length; row++ )
	{
		table += `<tr>
		<td>${jData[row].FirstName}</td>
		<td>${jData[row].LastName}</td>
		<td>${jData[row].Phone}</td>
		<td>${jData[row].Email}</td>
		<td><button class="edit_button">Update</button></td>
		<td><button class="del_button">Delete</button></td>
		</tr>`;
		
	}
	table += "</tr></table>";
	document.getElementById("contactTable").innerHTML = table;
	let tableId = document.getElementById("contacts");
	tableId.addEventListener('click', function(e) { handleTableEvent(e); }, false);
}
