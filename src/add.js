'use strict'

const { ipcRenderer } = require('electron')
var randomize = require('randomatic');

document.getElementById('newBroker').addEventListener('submit', (evt) => {
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


