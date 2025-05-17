const urlBase = "http://" + window.location.hostname + "/LAMPAPI";

fetch(urlBase + "/GetContacts.php", {
    method: "POST",
    body: {ID: 1}
}).then((response) => {
    console.log(response.text())
})