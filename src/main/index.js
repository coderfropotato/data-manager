'use strict'

import {app, BrowserWindow, ipcMain, dialog} from 'electron'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#`
  : `file://${__dirname}/index.html`

const baseURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#`
  : `file://${__dirname}/index.html#`

function createWindow () {
  mainWindow = new BrowserWindow({
    minHeight: 500,
    minWidth: 800,
    height: 700,
    width: 1120,
    useContentSize: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
ipcMain.on('addFile', (event, arg) => {
  if (arg.API === 'open') {
    let URL = arg.URL
    let newWin = new BrowserWindow({
      height: 400,
      width: 700
    })
    newWin.loadURL(baseURL + URL)
  }
})

ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})

ipcMain.on('files-modified', function (event) {
  const options = {
    type: 'info',
    title: 'Information',
    message: '文件有更改，是否查看',
    buttons: ['是', '否']
  }
  dialog.showMessageBox(options, function (index) {
    event.sender.send('dialog-select', index)
  })
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
