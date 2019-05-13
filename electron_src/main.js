const { app, BrowserWindow } = require('electron');
const path = require('path');

console.log('Game running in electron');

/** @type {BrowserWindow | null} */
let window = null;

function createWindow () {
    // Create the browser window
    window = new BrowserWindow({
    	width: 1280,
    	height: 720,
    	autoHideMenuBar: true,
    	title: 'ZeroG-Ball',
		icon: path.join(__dirname, '..', 'src', 'img', 'favicon.png'),
    });

    // Load the index.html
    window.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    window.setMenu(null);

    window.on('closed', function () {
    	window = null;
  	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if(process.platform !== 'darwin')
		app.quit();
});

app.on('activate', function () {
	if(window === null)
		createWindow();
});
