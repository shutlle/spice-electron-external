'use strict'

const path = require('path')
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const shell = require('electron').shell

const Window = require('./Window')
const DataStore = require('./DataStore')

const randomize = require('randomatic');

//const spiceClientURL = 'http://localhost/spice-web-client/index.html?host=192.168.43.111&port=5999'

require('electron-reload')(__dirname)


// create a store name for new brokers
//path: c:\Users\Рамис\AppData\Roaming\spice-client\
const brokersData = new DataStore({ name: 'brokers-config' })


function main () {
  // brokers list window
  let mainWindow = new Window({
    file: path.join('src', 'index.html')
  })


  // add broker window
  let addNewBrokerWindow
  let loginWindow


  // initialize with brokers
  mainWindow.once('show', () => {
    mainWindow.webContents.send('brokers', brokersData.brokers)
  })

  // create add new broker window
  ipcMain.on('add-new-broker-window', () => {
    // if addNewBrokerWindow does not already exist
    if (!addNewBrokerWindow) {
      // create a new add broker window
      addNewBrokerWindow = new Window({
        file: path.join('src', 'add.html'),
        width: 500,
        height: 400,
        alwaysOnTop: true,
        parent: mainWindow
      })
      addNewBrokerWindow.setMenu(null)

      // cleanup
      addNewBrokerWindow.on('closed', () => {
        addNewBrokerWindow = null
      })
    }
  })



  // create login window
  ipcMain.on('login-window', (event, broker) => {
    if (!loginWindow) {
      loginWindow = new Window({
        file: path.join('src', 'login.html'),
        width: 600,
        height: 400,
        alwaysOnTop: true,
        parent: mainWindow
      })
      loginWindow.setMenu(null)
    
      // cleanup
      loginWindow.on('closed', () => {
        loginWindow = null
      })
    }

    // send data about one broker to login window
    loginWindow.once('show', () => {
      const getOneBroker = brokersData.getBroker(broker).brokers_once
      //const getOneBroker = randomize('0', 8)
      loginWindow.webContents.send('get-broker', getOneBroker)
    })
  })



  // from add broker window
  ipcMain.on('new-broker', (event, broker) => {
    const updatedBrokers = brokersData.addBroker(broker).brokers
    mainWindow.send('brokers', updatedBrokers)
  })

  // delete broker from brokers list window
  ipcMain.on('delete-broker', (event, broker) => {
    const updatedBrokers = brokersData.deleteBroker(broker).brokers
    mainWindow.send('brokers', updatedBrokers)
  })

  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label:'Yandex',
          click() { 
            shell.openExternal('http://ya.ru')
          },
          accelerator: 'CmdOrCtrl+Shift+Y'
        },
        {
          label:'Spice Web Client',
          click() { 
            shell.openExternal(spiceClientURL)
          },
          accelerator: 'CmdOrCtrl+Shift+S'
        },
        {type:'separator'},
        {
          label:'Exit',
          click() { 
              app.quit() 
          }
        }
      ]
    },
    {
      label: 'Info'
    }
  ])
  Menu.setApplicationMenu(menu);
}


app.on('ready', main)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';