'use strict'

const electron = require('electron')
const remote = electron.remote
const { ipcRenderer } = electron

const cancelBtn = document.getElementById('cancelBtn')
const loginBtn = document.getElementById('loginBtn')

cancelBtn.addEventListener('click', function (event) {
  var window = remote.getCurrentWindow()
  window.close()
})


loginBtn.addEventListener('click', function (event) {
  ipcRenderer.send('vm-list-window')
  var window = remote.getCurrentWindow()
  window.close()
})


// on receive broker id
ipcRenderer.on('get-broker', (event, brokers) => {
  console.log(brokers)
  const brokerAddress = document.getElementById('brokerAddress')
  brokerAddress.value = brokers[0].address

})


