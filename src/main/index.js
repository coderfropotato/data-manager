'use strict'

import { app, BrowserWindow, ipcMain, dialog, Tray ,Menu,nativeImage } from 'electron'
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

function createWindow() {
  mainWindow = new BrowserWindow({
    // minHeight: 500,
    // minWidth: 800,
    height: 800,
    width: 1200,
    useContentSize: true
  })
  mainWindow.setMinimumSize(1200, 800)
  mainWindow.loadURL(winURL)
  mainWindow.setMenu(null)
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // //系统托盘图标
  // let tray = new Tray(icon)
  // //tip
  // tray.setToolTip('gooalgene-data-manager')
  // //双击icon 显示窗口
  // tray.on('double-click', () => {
  //   mainWindow.show()
  //   mainWindow.focus()
  // });
  // tray.on('right-click', () => {
  //   let contextMenu = Menu.buildFromTemplate([
  //     {
  //       label: '退出系统',
  //       click: function () {
  //         tray.destroy()
  //         app.quit()
  //       }
  //     }
  //   ]);
  //   tray.setContextMenu(contextMenu);
  // })
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

//关闭app
ipcMain.on('window-all-closed', () => {
  // dialog.showMessageBox({
  //   type: "question",
  //   title: "提示信息",
  //   buttons: ['确定', 'cancel'],
  //   message: '点击"确定"退出程序'
  // }, function (index) {
  //   // if(process.platform!=='darwin')
  //   if (index == 0) app.quit()
  // })
  mainWindow.minimize();
  mainWindow.setSkipTaskbar(true)
});
//小化
ipcMain.on('hide-window', (ev) => {
  mainWindow.minimize();
  mainWindow.setSkipTaskbar(false)
});
//最大化
ipcMain.on('show-window', () => {
  mainWindow.maximize();
  mainWindow.setSkipTaskbar(false)
});
//还原
ipcMain.on('orignal-window', () => {
  mainWindow.unmaximize();
  mainWindow.setSkipTaskbar(false)
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
