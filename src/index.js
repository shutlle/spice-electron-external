'use strict'

const electron = require('electron')
const { ipcRenderer } = electron
const { dialog } = electron.remote
const { remote } = electron
const path = require('path')
const addNewBroker = document.getElementById('addNewBroker')


// create add new broker window button
addNewBroker.addEventListener('click', () => {
  ipcRenderer.send('add-new-broker-window')
})

// login window event function
const loginForm = (e) => {
  var t = e.target
  while(t && !t.id) t = t.parentNode
  if (t) {
    //console.log(t.id)
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



ipcRenderer.on('vm-load', () => {
  var vmPageFile = path.join('src', 'vm.html')
  var window = remote.getCurrentWindow()
  window.loadFile(vmPageFile)
})
