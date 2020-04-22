'use strict'

const { ipcRenderer } = require('electron')
var randomize = require('randomatic');

document.getElementById('newBroker').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const nameBorker = evt.target[0]
  const addressBorker = evt.target[1]
  var _broker = {
    name: nameBorker.value,
    address: addressBorker.value,
    id: randomize('0', 12)
    //data: [0,4,6] //application data for request (String, Array, Object)
  };

  // send todo to main process
  //ipcRenderer.send('new-broker', nameBorker.value, )
  ipcRenderer.send('new-broker', _broker)

  // reset input
  nameBorker.value = ''
  addressBorker.value = ''
})


