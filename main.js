'use strict'

const path = require('path')
const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const shell = require('electron').shell

const Window = require('./Window')
const DataStore = require('./DataStore')

//const spiceClientURL = 'http://localhost/spice-web-client/index.html?host=192.168.43.111&port=5999'

require('electron-reload')(__dirname)


// create a store name for new brokers
//path: c:\Users\Рамис\AppData\Roaming\spice-client\
const brokersData = new DataStore({ name: 'brokers-config' })


function main () {
  // todo list window
  let mainWindow = new Window({
    file: path.join('src', 'index.html')
  })


  // add broker window
  let addNewBrokerWindow

  // TODO: put these events into their own file


  // initialize with brokers
  mainWindow.once('show', () => {
    mainWindow.webContents.send('brokers', brokersData.brokers)
  })

  // create add new broker window
  ipcMain.on('add-new-broker-window', () => {
    // if addTodoWin does not already exist
    if (!addNewBrokerWindow) {
      // create a new add todo window
      addNewBrokerWindow = new Window({
        file: path.join('src', 'add.html'),
        width: 400,
        height: 300,
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

  // from add broker window
  ipcMain.on('new-broker', (event, broker) => {
    const updatedBrokers = brokersData.addBroker(broker).brokers

    mainWindow.send('brokers', updatedBrokers)
  })

  // delete broker from brokers list window
  ipcMain.on('delete-broker', (event, broker) => {
    const updatedBrokers = brokersData.deleteBroker(broker).brokers
    console.log(broker)
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