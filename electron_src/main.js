const { app, BrowserWindow } = require('electron');

function createWindow () {
    // Create the browser window.
    let win = new BrowserWindow({ width: 1280, height: 720});

    // Load the index.html.
    win.loadFile('dist/index.html');
}

app.on('ready', createWindow);
