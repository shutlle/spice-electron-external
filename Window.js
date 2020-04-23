'use strict'

const path = require('path')
const { BrowserWindow } = require('electron')

// default window settings
const defaultProps = {
  width: 800,
  height: 600,
  show: false,
  resizable: false,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true
  }
}

class Window extends BrowserWindow {
  constructor ({ file, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings })

    // load the html and open devtools
    this.loadFile(file)
    this.webContents.openDevTools()

    // gracefully show when ready to prevent flickering
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = Window