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

  // add todo window
  let addTodoWin

  // TODO: put these events into their own file


  // initialize with brokers
  mainWindow.once('show', () => {
    mainWindow.webContents.send('brokers', brokersData.brokers)
  })

  // create add new broker window
  ipcMain.on('add-new-broker-window', () => {
    // if addTodoWin does not already exist
    if (!addTodoWin) {
      // create a new add todo window
      addTodoWin = new Window({
        file: path.join('src', 'add.html'),
        width: 400,
        height: 300,
        // close with the main window
        parent: mainWindow
      })

      // cleanup
      addTodoWin.on('closed', () => {
        addTodoWin = null
      })
    }
  })

  // from add broker window
  ipcMain.on('new-broker', (event, todo) => {
    const updatedTodos = brokersData.addBroker(todo).brokers

    mainWindow.send('brokers', updatedTodos)
  })

  // delete-broker from todo list window
  ipcMain.on('delete-broker', (event, todo) => {
    const updatedTodos = brokersData.deleteBroker(todo).brokers

    mainWindow.send('brokers', updatedTodos)
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