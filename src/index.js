const electron = require('electron')
const spiceBtn = document.getElementById('spiceBtn')
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote



// create add new broker window button
document.getElementById('addNewBroker').addEventListener('click', () => {
  ipcRenderer.send('add-new-broker-window')
})

const loginForm = (e) => {
  var t = e.target
  while(t && !t.id) t = t.parentNode
  if (t) {
    console.log(t.id)
    ipcRenderer.send('login-window', t.id)
  }
}

// broker delete event function
const deleteBroker = (e) => {
  const options  = {
    type: 'question',
    defaultId: 1,
    title: 'Delete broker',
    buttons: ["Yes","No"],
    message: "Do you really want to delete this broker?"
  }
  dialog.showMessageBox(options)
  .then (result => {
    if (result.response === 0) {
      var t = e.target
      while(t && !t.id) t = t.parentNode
      if (t) {
        //console.log(t.id)
        ipcRenderer.send('delete-broker', t.id)
      }
    }
  })
}


// on receive brokers
ipcRenderer.on('brokers', (event, brokers) => {
  // get the brokerList ul
  const brokerList = document.getElementById('brokerList')

  // create html string
  const brokerItems = brokers.reduce((html, broker) => {
    html += `<button id=${broker.id} class="list-group-item list-group-item-action">
    <h3 class="display-4">${broker.name}
    <small class="text-muted">${broker.address}</small></h3></button>`

    return html
  }, '')

  // set list html to the broker items
  brokerList.innerHTML = brokerItems

  // add click handlers to delete the clicked broker
  brokerList.querySelectorAll('.list-group-item-action').forEach(item => {
    item.addEventListener('contextmenu', deleteBroker)
  })

  brokerList.querySelectorAll('.list-group-item-action').forEach(item => {
    item.addEventListener('click', loginForm)
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


