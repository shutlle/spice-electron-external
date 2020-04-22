'use strict'

const { ipcRenderer } = require('electron')

document.getElementById('newBroker').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const nameBorker = evt.target[0]
  const addressBorker = evt.target[1]
  console.log(addressBorker)

  // send todo to main process
  ipcRenderer.send('new-broker', nameBorker.value, )


  // reset input
  nameBorker.value = ''
})


