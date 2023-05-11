// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  start: () => start(),
  ping: () => ipcRenderer.invoke('ping'),
  login: () => login(),
  logout: () => logout(),
  loginQuit: () => loginQuit(),
  windowMin: () => windowMin(),
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, (process.versions as any)[type]);
  }
});

function start() {
  ipcRenderer.on('msg', (event, message) => {
    console.log('msg', message); // 消息来自主进程
  });
  ipcRenderer.send('indexMsg', '消息来自渲染进程');
}

function login() {
  ipcRenderer.send('login', 'login');
}
function logout() {
  ipcRenderer.send('logout', 'logout');
}
function loginQuit() {
  ipcRenderer.send('login-quit', 'login-quit');
}
function windowMin() {
  ipcRenderer.send('window-min', 'window-min');
}
