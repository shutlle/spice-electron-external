'use strict'

const { ipcRenderer } = require('electron')

document.getElementById('loginBtn').addEventListener('submit', (evt) => {
  console.log("login")
})


// on receive broker id
ipcRenderer.on('get-broker', (event, brokers) => {
  console.log(brokers)
  const brokerAddress = document.getElementById('brokerAddress')
  brokerAddress.value = brokers[0].address

})
