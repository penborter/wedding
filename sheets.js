
// Initial check that the invite code is valid 
function validateForm(form) {
  var regex = new RegExp("^[a-zA-Z]+$");
  var inviteCode = form.code.value;
  // Code should be 6 letters
  if (inviteCode.length != 6 || !(regex.test(inviteCode))) {
    alert("Invalid code! Make sure to enter the six letters on the card attached to your invitation.");
    return false;

  } else {
    getRequest(form);
    document.querySelector("#code_submit").innerHTML = "Loading...";
  }
}

function getRequest(form) {
  var inviteCode = form.code.value;
  var url = form.action;
  url = url + "?code=" + inviteCode.toUpperCase();
  console.log('Running');
  console.log(inviteCode);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.responseType = "json";
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {        
        console.log(xhr.response);
        var response = xhr.response["data"];

        // If the code has already been used to RSVP 
        if (response === "no_form") {
          console.log("No form");
          noForm();
        } else if (response === "no_match") {
          //console.log(response);
          noMatch();
        } else {
          generateForm(response, inviteCode);
        }
      }
    }
  
  xhr.send();
}

// For when the get request returns "no_form", i.e. they've already RSVP'd
function noForm() {
  document.querySelector("p.welcome").innerHTML = 
    "We've already received your response! If you need to change your response, please reach out to Ben or Claudia directly.</p><p>Otherwise, take a look at the <a href='info.html'>Info</a> page to learn what you need to know for the day.";
  document.querySelector(".invite_code").style.display = "none";
}

// For when the get request returns "no_match", i.e. entered a code not in the RSVP list
function noMatch() {
  alert("Invalid code! Make sure to enter the six letters on the card attached to your invitation.");
  document.querySelector("#code_submit").innerHTML = "Submit";
}

// To generate the RSVP form based on the Gsheets response
function generateForm(response, inviteCode) {

  var names = response.filter(n => n);
  var numNames = names.length;
  var namesContent = "";

  // Add the code to the "code" input
  document.querySelector("input.hidden").value = inviteCode;

  // Add the correct amount of check boxes, with matching names
  var nameChecks = document.querySelector("span.nameChecks");
  nameChecks.innerHTML = names.map((name, index) =>
  `<span class="radio_label" style="text-transform: capitalize;"><i>${name}:</i></span><br>
  <input type="radio" id="name_${index}_true" name="name_${index}" value="True">
  <label for="name_${index}_true">Attending</label><br>
  <input type="radio" id="name_${index}_false" name="name_${index}" value="False">
  <label for="name_${index}_false">Can't make it</label><br>
  `
  ).join('');

  // Create text list of names, to show in "welcome" paragraph
  if (numNames == 1) {
  namesContent = document.createTextNode(names[0]);
  } else {
  namesContent = names.slice(0,-1).join(", ") + " <i>&</i> " + names.slice(-1);
  }

  document.querySelector("p.welcome").innerHTML = "Welcome " + namesContent + "!";
  document.querySelector("form.hidden").style.display = "block";
  document.querySelector(".invite_code").style.display = "none";
}

function handleCodeSubmit(event) {
  event.preventDefault();
  var form = event.target;
  
  // Check code input is in correct format
  validateForm(form);
  //getRequest(form.code.value);
}

document.querySelector('.invite_code').addEventListener("submit", handleCodeSubmit, false);