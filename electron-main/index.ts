import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  Menu,
  BrowserView,
} from 'electron';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import is_dev from 'electron-is-dev';
import { join } from 'path';
console.log('hello start');
const path = require('path');
let mainWindow: BrowserWindow | null = null;
class createWin {
  constructor() {
    const displayWorkAreaSize = screen.getAllDisplays()[0].workArea;
    mainWindow = new BrowserWindow({
      // width: parseInt(`${displayWorkAreaSize.width * 0.85}`, 10),
      // height: parseInt(`${displayWorkAreaSize.height * 0.85}`, 10),
      width: 1000,
      height: 480,
      movable: true,
      // frame: false,
      show: false,
      center: true,
      resizable: false,
      // frame: false,
      titleBarStyle: 'hidden',
      transparent: true,
      // transparent: true,
      webPreferences: {
        contextIsolation: true,
        enableRemoteModule: true,
        webviewTag: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      // backgroundColor: '#ffffff00',
      autoHideMenuBar: true,
    });
    const URL = is_dev
      ? `http://localhost:${process.env.PORT}` // vite 启动的服务器地址
      : `file://${join(__dirname, '../index.html')}`; // vite 构建后的静态文件地址

    mainWindow.loadURL(URL);
    // mainWindow.loadFile(path.join(__dirname, '../index.html'));
    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });
    ipcMain.handle('ping', () => '消息来自主进程pong');
    mainWindow.webContents.openDevTools();
  }
}

app
  .whenReady()
  .then(() => new createWin())
  .then(async () => {
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  });

await installExtension({
  id: 'ljjemllljcmogpfapbkkighbhhppjdbg', // vue3拓展id
  electron: '>=1.2.1',
});

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      mainWindow.focus();
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new createWin();
  }
});

ipcMain.on('sumbit', (event, arg) => {
  console.log(arg);
});

ipcMain.on('indexMsg', (event, arg) => {
  console.log('indexMsg', arg);
});

ipcMain.on('login', (event, arg) => {
  console.log('login 成功', arg);
  if (mainWindow) {
    mainWindow.resizable = true;
    mainWindow.setSize(1600, 900);
    mainWindow.center();
    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });
    mainWindow.resizable = false;
  }
});

ipcMain.on('logout', (event, arg) => {
  if (mainWindow) {
    mainWindow.resizable = true;
    console.log('logout 成功', arg);
    mainWindow.setSize(1000, 480);
    mainWindow.center();
    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });
    mainWindow.resizable = false;
  }
});

ipcMain.on('login-quit', (event, arg) => {
  mainWindow?.close();
});

ipcMain.on('window-min', (event, arg) => {
  mainWindow?.minimize();
});
