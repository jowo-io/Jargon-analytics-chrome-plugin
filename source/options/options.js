//when the options page has fully loaded / is ready
//we look for changes to the #file id / element
//and when we see a file added, we load it.
$(document).ready(function() {
  $("#file").change(function() {
    var file = document.getElementById("file").files[0];
    if (file) {
      loadFile(file);
    }
  });
});

//load the file and read it's contents and
//assign functions to the different possible events
function loadFile(readFile) {
  var reader = new FileReader();
  reader.readAsText(readFile);
  // Handle progress, success, and errors
  reader.onprogress = updateProgress;
  reader.onload = loaded;
  reader.onerror = errorHandler;
}

//this function can be used to show some sort of feedback for the
//file upload, but it is currently an "empty shell" just the basic functionality,
function updateProgress(event) {
  if (event.lengthComputable) {
    // event.loaded and event.total are ProgressEvent properties
    var loaded = event.loaded / event.total;
    if (loaded < 1) {
      // Increase the prog bar length
      // style.width = (loaded * 200) + "px";
    }
  }
}

//when the file has been loaded we get the data from the event parameter
//and parse it to the emitData function to be sent to the contentscript.js file
//and then updates the feedback element with a success message
function loaded(event) {
  var fileString = event.target.result;
  emitData(fileString);
  $("#feedback").html("New file successfully uploaded.");
  $("#feedback").removeClass(); //remove all old classes
  $("#feedback").addClass("success");
}

//provide some basic feedback for when the upload fails
function errorHandler(event) {
  if (event.target.error.name == "NotReadableError") {
    $("#feedback").html("There was an error uploading your file.");
    $("#feedback").removeClass(); //remove all old classes
    $("#feedback").addClass("error");
  }
}

//this function receives the data from the file and then
//sends it to the any scripts that are listening (contentscript.js)
//the response is currently only logged to the console, nothing else is done with it.
function emitData(data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { data: data }, function(response) {
      console.log(response);
    });
  });
}
