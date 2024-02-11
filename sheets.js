
function getRequest(inviteCode) {
  var url = 'https://script.google.com/macros/s/AKfycbyx3UnFql1mRzvOjFfTTi9oZ6TpOoybKy_rndRUyhHWUfBwKuFV68FkRn9YIbJM9smx/exec';
  url = url + "?code=" + inviteCode;
  console.log('Running');

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = "json";
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {        
        if (xhr.response["data"] === "no_form") {
          noForm();
        } else {
          generateForm(xhr.response, inviteCode);
        }
      }
    }
  
  xhr.send();
}

function validateForm(form) {
  if (form.code.value.length != 6) {
    alert("Invalid code - check your invitation again!");
    return false;

  } else {
    //getRequest(form.code.value)
  }
}

function noForm() {
  document.querySelector("p.welcome").innerHTML = "We've already received your RSVP! If you need to change your response, please reach out to Ben or Claudia directly.";
  document.querySelector(".invite_code").style.display = "none";
}

function generateForm(response, inviteCode) {

  var names = response["data"];
  var numNames = names.length;
  var namesContent = "";

  // Add the code to the "code" input
  document.querySelector("input.hidden").value = inviteCode;

  // Add the correct amount of check boxes, with matching names
  var nameChecks = document.querySelector("span.nameChecks");
  nameChecks.innerHTML = names.map((name, index) =>
  `<span class="radio_label"><i>${name}:</i></span><br>
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
  
  // TODO - First need to validate code is legit
  getRequest(form.code.value);
}

document.querySelector('.invite_code').addEventListener("submit", handleCodeSubmit, false);