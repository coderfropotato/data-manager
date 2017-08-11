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

/*
 * 在主窗口和新打开的窗口之间传递数据
 * @call{mode: '', API: ''} mode: 'action'/'mutation' API: action/mutation 中的方法
 * @data 数据
 */
let newWin
ipcMain.on('change-data', (event, call, data) => {
  mainWindow.webContents.send('change-data', call, data)
})

// 打开添加文件窗口
ipcMain.on('addFile', (event, arg) => {
  if (arg.API === 'open') {
    let URL = arg.URL
    newWin = new BrowserWindow({
      height: 600,
      width: 800
    })
    newWin.loadURL(baseURL + URL)
  }
  if (arg.API === 'close') {
    newWin.close()
  }
})

// 打开浏览本地文件的窗口
ipcMain.on('open-file-dialog', function (event, type, target) {
  // 默认只能打开单个文件夹
  let properties = ['openFile']
  if (type !== 'single') {
    properties.push('multiSelections')
  }
  // 默认情况下，target 为空，打开目录
  if (!target) {
    properties.push('openDirectory')
  }
  dialog.showOpenDialog({
    // 只打开文件夹
    properties
  }, function (files) {
    if (files) {
      event.sender.send('selected-directory', files)
    }
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
