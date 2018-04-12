'use strict'

import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Tray,
  Menu,
  nativeImage
} from 'electron'
import { create } from 'domain';

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let trayIcon = nativeImage.createFromPath(__dirname + '/static/icon.png');
let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#` :
  `file://${__dirname}/index.html`

const baseURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080/#` :
  `file://${__dirname}/index.html#`

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    height: 860,
    width: 1200,
    minHeight: 860,
    minWidth: 1200,
    frame: false,
    skipTaskbar: false,
    thickFrame: true,
    useContentSize: true,
    show: false,
    titleBarStyle: "customButtonsOnHover",
  })
  mainWindow.setMinimumSize(1200, 860);
  mainWindow.loadURL(winURL);
  mainWindow.setMenu(null);
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null;
    tray = null;
    app.quit();
  })
  mainWindow.on('resize', (ev) => {
    ev.sender.send('windowResize')
  })
  mainWindow.once('ready-to-show', _ => {
    mainWindow.show()
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
  let contextMenu = Menu.buildFromTemplate([{
    label: '退出系统',
    click: function () {
      tray.destroy()
      app.quit()
    }
  }]);
  
  tray.on('right-click', () => {
    tray.setContextMenu(contextMenu);
  })

  /***********************************************************
   * 生成快捷方式 grunt-electron-installer
   **********************************************************/
  var handleStartupEvent = function () {
    if (process.platform !== 'win32') {
      return false;
    }

    var squirrelCommand = process.argv[1];

    switch (squirrelCommand) {
      case '--squirrel-install':
      case '--squirrel-updated':
        install();
        return true;
      case '--squirrel-uninstall':
        uninstall();
        app.quit();
        return true;
      case '--squirrel-obsolete':
        app.quit();
        return true;
    }
    // 安装
    function install() {
      var cp = require('child_process');
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--createShortcut", target], {
        detached: true
      });
      child.on('close', function (code) {
        app.quit();
      });
    }
    // 卸载
    function uninstall() {
      var cp = require('child_process');
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--removeShortcut", target], {
        detached: true
      });
      child.on('close', function (code) {
        app.quit();
      });
    }

  };

  if (handleStartupEvent()) {
    return;
  }
}

/*
 * 在主窗口和新打开的窗口之间传递数据
 * @call{mode: '', API: ''} mode: 'action'/'mutation' API: action/mutation 中的方法
 * @data 数据
 */
ipcMain.on('change-data', (event, call, data) => {
  mainWindow.webContents.send('change-data', call, data)
})
/*设备添加成功 重新获取设备列表/文件状态(暂时关闭)*/
ipcMain.on('updateFilesList', (event) => {
  mainWindow.webContents.send('updateFilesList');
})
/*打开/关闭添加文件窗口*/
var newWin;
ipcMain.on('addFile', (event, arg) => {
  if (arg.API === 'open') {
    let URL = arg.URL
    if (newWin === undefined) {
      newWin = new BrowserWindow({
        height: 340,//340
        width: 650,//650
        resizable: false,
        frame: false,
        show: false
      })
      newWin.setMenu(null);
      newWin.loadURL(baseURL + URL)
      newWin.once('ready-to-show', _ => {
        newWin.show();
      })
    } else {
      newWin.show();
      newWin.focus();
    }

  }
  if (arg.API === 'close') {
    newWin.close()
    newWin = undefined;
  } else if (arg.API === 'mini') {
    newWin.minimize();
  }
})
/*新窗口改变大小hook*/
ipcMain.on('resetWinSize', (ev, args) => {
  newWin.setSize(args[0], args[1]);
});
/* 打开浏览本地文件的窗口*/
ipcMain.on('open-file-dialog', function (event, type, target) {
  /* 默认只能打开单个文件夹*/
  let properties = ['openFile']
  if (type !== 'single') {
    properties.push('multiSelections')
  }
  /* 默认情况下，target 为空，打开目录*/
  if (!target) {
    properties.push('openDirectory')
  }
  dialog.showOpenDialog({
    /* 只打开文件夹*/
    properties
  }, function (files) {
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})
/* 选择文件*/
ipcMain.on('selectFile', (e, ename) => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (path) {
    if (path) {
      e.sender.send(ename, path)
    }
  })
})


/* 关闭app*/
ipcMain.on('window-all-closed', () => {
  /*dialog.showMessageBox({
    type: "question",
    title: "提示信息",
    buttons: ['确定', 'cancel'],
    message: '点击"确定"退出程序'
  }, function (index) {
     if(process.platform!=='darwin')
    if (index == 0) app.quit()
  })
  TODO: 关闭与最小化表现一致, 要加上will-quit事件？让app关闭python
  mainWindow.minimize();*/
  mainWindow.setSkipTaskbar(true);
  app.quit();
});

/*最小化*/
ipcMain.on('hide-window', (ev) => {
  mainWindow.minimize();
  mainWindow.setSkipTaskbar(false)
});
/* 切换窗口大小*/
ipcMain.on('change-window', (ev) => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    ev.sender.send('resetLayout', 65);
  } else {
    mainWindow.maximize();
    ev.sender.send('resetLayout', 70);
  }
  mainWindow.setSkipTaskbar(false)
})


/* 重复点击图标*/
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  /*若最小化则还原*/
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});
if (shouldQuit) {
  app.quit();
}


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


/**
 * app hook
 */
app.on('ready', function () {
  let crPro = function () {
    return new Promise((resolve, reject) => {
      createPyProc();
      resolve();
    })
  }

  let crWindow = function () {
    return new Promise((resolve, reject) => {
      createWindow();
      resolve();
    })
  }

  const main = async () => {
    try {
      await crPro();
      await crWindow();
    } catch (e) { console.log(e) }
  }
  main();
});
app.on('will-quit', exitPyProc)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});


/**
 * auto updater
 * joke <277637411@qq.com>
 */
function updateHandle(){
  let message={
    error:'检查更新出错',
    checking:'正在检查更新……',
    updateAva:'检测到新版本，正在下载……',
    updateNotAva:'现在使用的就是最新版本，不用更新',
  };
  const os = require('os');
  autoUpdater.setFeedURL('https://github.com/YeahPotato/electron-release-packages.git');
  autoUpdater.on('error', function(error){
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function() {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function(info) {
      sendUpdateMessage(message.updateAva)
  });
  autoUpdater.on('update-not-available', function(info) {
      sendUpdateMessage(message.updateNotAva)
  });
  
  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
      mainWindow.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded',  function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      ipcMain.on('isUpdateNow', (e, arg) => {
          //some code here to handle event
          autoUpdater.quitAndInstall();
      })
      mainWindow.webContents.send('isUpdateNow')
  });
  
  //执行自动更新检查
  autoUpdater.checkForUpdates();
}

// 通过main进程发送事件给renderer进程，提示更新信息
// mainWindow = new BrowserWindow()
function sendUpdateMessage(text){
  mainWindow.webContents.send('message', text)
}