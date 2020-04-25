'use strict'

const electron = require('electron')
const remote = electron.remote
const { ipcRenderer } = electron
const randomize = require('randomatic')

const cancelBtn = document.getElementById('cancelBtn')
const newBrokerBtn = document.getElementById('newBroker')

newBrokerBtn.addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const nameBroker = evt.target[0]
  const addressBroker = evt.target[1]
  var _broker = {
    name: nameBroker.value,
    address: addressBroker.value,
    id: randomize('0', 12)
    //data: [0,4,6] //application data for request (String, Array, Object)
  };

  // send todo to main process
  //ipcRenderer.send('new-broker', nameBroker.value, )
  ipcRenderer.send('new-broker', _broker)

  // reset input
  nameBroker.value = ''
  addressBroker.value = ''

})


cancelBtn.addEventListener('click', function (event) {
  var window = remote.getCurrentWindow();
  window.close();
})
