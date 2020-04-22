const electron = require('electron')
const spiceBtn = document.getElementById('spiceBtn')
const { ipcRenderer } = require('electron')

// create add todo window button
document.getElementById('addNewBroker').addEventListener('click', () => {
  ipcRenderer.send('add-new-broker-window')
})

const deleteBroker = (e) => {
  ipcRenderer.send('delete-broker', e.target.textContent)
}


// on receive todos
ipcRenderer.on('brokers', (event, brokers) => {
  // get the brokerList ul
  const brokerList = document.getElementById('brokerList')

  // create html string
  const brokerItems = brokers.reduce((html, broker) => {
    html += `<li class="list-group-item list-group-item-action">${broker}</button>`

    return html
  }, '')

  // set list html to the todo items
  brokerList.innerHTML = brokerItems

  // add click handlers to delete the clicked broker
  brokerList.querySelectorAll('.list-group-item-action').forEach(item => {
    item.addEventListener('click', deleteBroker)
  })
})

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



