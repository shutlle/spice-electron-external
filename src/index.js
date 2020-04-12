const electron = require('electron')
const spiceBtn = document.getElementById('spiceBtn')


function launchChildProcess(executablePath, parameters) {
  var child = require('child_process').execFile;
  child(executablePath, parameters, function(err, data) {
    if(err){
      console.error(err);
      return;
    }
    console.log(data.toString());
  });
}

spiceBtn.addEventListener('click', function (event) {
  //https://www.mankier.com/1/remote-viewer
  var spiceClientAppPath = "C:\\Program Files (x86)\\VirtViewer v8.0-256\\bin\\remote-viewer.exe";

  var spiceGuestURI = document.getElementById('spiceURI').value
  if (spiceGuestURI == '') {
    spiceGuestURI = "localhost:5900";
  }
  var parameters = ['spice://'+spiceGuestURI, "--full-screen"];
  launchChildProcess(spiceClientAppPath, parameters);
  console.log(spiceGuestURI);
})



