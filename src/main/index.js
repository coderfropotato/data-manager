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
// 打开文件窗口
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

// 读取本地文件
ipcMain.on('readLocalFile', (event, arg) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, function (files) {
    if (files) event.sender.send('selected-directory', files)
  })
})
