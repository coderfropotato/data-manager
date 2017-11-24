'use strict'

import { app, BrowserWindow, ipcMain, dialog, Tray ,Menu,nativeImage } from 'electron'
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let trayIcon = nativeImage.createFromPath(__dirname+'/static/icon.png');
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#`
  : `file://${__dirname}/index.html`

const baseURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#`
  : `file://${__dirname}/index.html#`

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 860,
    width: 1200,
    minHeight: 860,
    minWidth: 1200,
    // frame: false,
    skipTaskbar: false,
    useContentSize: true,
    titleBarStyle: 'customButtonsOnHover',
    title: 'Preferences'
  })
  mainWindow.setMinimumSize(1200, 860)
  mainWindow.loadURL(winURL)
  mainWindow.setMenu(null)
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null;
    tray = null;
    app.quit();
  })
  mainWindow.on('resize',(ev)=>{
    ev.sender.send('windowResize')
  })

  // //系统托盘图标
  let tray = new Tray(trayIcon)
  //tip
  tray.setToolTip('数据管理系统')
  //双击icon 显示窗口
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setSkipTaskbar(false);
  });
  tray.on('right-click', () => {
    let contextMenu = Menu.buildFromTemplate([
      {
        label: '退出系统',
        click: function () {
          tray.destroy()
          app.quit()
        }
      }
    ]);
    tray.setContextMenu(contextMenu);
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
ipcMain.on('updateFilesList',(event)=>{
  mainWindow.webContents.send('updateFilesList');
})
// 打开/关闭添加文件窗口
ipcMain.on('addFile', (event, arg) => {
  if (arg.API === 'open') {
    let URL = arg.URL
    newWin = new BrowserWindow({
      height: 500,
      width: 700,
      resizable:false
    })
    newWin.setMenu(null);
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
// 选择文件
ipcMain.on('selectFile',(e,ename)=>{  dialog.showOpenDialog({
    properties:['openFile']
  }, function (path) {
    if (path) {
      e.sender.send(ename, path)
    }
  })
})
app.on('ready', createWindow)

//关闭app
ipcMain.on('window-all-closed', () => {
  dialog.showMessageBox({
    type: "question",
    title: "提示信息",
    buttons: ['确定', 'cancel'],
    message: '点击"确定"退出程序'
  }, function (index) {
    // if(process.platform!=='darwin')
    if (index == 0) app.quit()
  })
  //TODO: 关闭与最小化表现一致, 要加上will-quit事件？让app关闭python
  // mainWindow.minimize();
  mainWindow.setSkipTaskbar(true)
});
//new window dom resize 
ipcMain.on('resetWinSize',(ev,args)=>{
  newWin.setSize(args[0],args[1]);
});
//最小化
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


/*************************************************************
 * py process
 *************************************************************/
const path = require('path')
const PY_DIST_FOLDER = 'dist'
const PY_FOLDER = 'backend'
const PY_MODULE = 'backend' // without .py suffix
const PY_PORT = 4242

let pyProc = null
let pyPort = null

const getScriptPath = () => {
  // if (process.env.NODE_ENV !== 'production') {
  //   return path.join(__dirname, 'backend', 'run.py')    // 这个路径应该请求不到，调试时后端需要手工启动
  // }
  if (process.platform === 'win32') {
    return path.join(__dirname, '..', 'backend', 'backend.exe')
  }
  return path.join(__dirname, '..', 'backend', 'backend')
}

const createPyProc = () => {
  let script = getScriptPath()
  let port = '' + PY_PORT
  
  // if (process.env.NODE_ENV === 'production') {
    // dialog.showErrorBox('title', process.env.NODE_ENV + '|\n' + script)
    pyProc = require('child_process').execFile(script, [port])
  // } else {
    // pyProc = require('child_process').spawn('python', [script, port])
  // }
 
  // if (pyProc != null) {
  //   console.log(pyProc)
  //   console.log('child process success on port ' + port)  // 启动失败也会打印
  // }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)
