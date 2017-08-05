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

// 打开添加文件窗口
ipcMain.on('addFile', (event, arg) => {
  if (arg.API === 'open') {
    let URL = arg.URL
    let newWin = new BrowserWindow({
      height: 500,
      width: 800
    })
    newWin.loadURL(baseURL + URL)
  }
})

// 打开浏览本地文件的窗口
ipcMain.on('open-file-dialog', function (event) {
  dialog.showOpenDialog({
    // 只打开文件夹
    properties: ['openFile', 'openDirectory', 'multiSelections']
  }, function (files) {
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})

// 监听渲染进程发送的文件更改消息，弹出通知窗口
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
