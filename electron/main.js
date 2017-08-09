'use strict';

const { app, Menu, globalShortcut, ipcMain } = require('electron');
const menubar = require('menubar');
const AutoLaunch = require('auto-launch');
const semver = require('semver');
const superagent = require('superagent');

const packageJson = 'https://raw.githubusercontent.com/4gray/oversetter/master/package.json';
const currentVersion = app.getVersion();

const keyboardShortcuts = {
	open: 'CommandOrControl+Alt+T',
	translateClipboard: 'CommandOrControl+Alt+R'
};

const mb = menubar({
	index: 'file://' + __dirname + '/index.html',
	width: 500,
	height: 315,
	resizable: false,
	preloadWindow: true,
	transparent: true,
	frame: false,
	showDockIcon: false,
	show: false
});

mb.on('ready', () => {
	if (process.env.NODE_ENV === 'dev')
		mb.window.openDevTools();

	// create the application's main menu
	const template = [{
		label: "Menu",
		submenu: [
			{ label: "Hide", accelerator: "Esc", click: () => mb.window.hide() },
			{ label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
			{ label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
			{ label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
			{ label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectall" },
			{
				label: 'Toggle Developer Tools',
				accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
				click(item, focusedWindow) {
					if (focusedWindow) focusedWindow.webContents.toggleDevTools()
				}
			},
			{
				label: "Quit",
				accelerator: "Command+Q",
				click: () => app.quit()
			}
		]
	}
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));

	// register show window shortcut listener
	globalShortcut.register(keyboardShortcuts.open, () => {
		mb.window.webContents.send('translate');
		showApp();
	});

	// register global shortcut for clipboard text trranslation
	globalShortcut.register(keyboardShortcuts.translateClipboard, () => {
		mb.window.webContents.send('translate-clipboard');
		showApp();
	});

	ipcMain.on('autolaunch', (event, arg) => {
		console.log('Autolaunch enabled: ' + arg);
		arg ? appLauncher.enable() : appLauncher.disable();
	});

});

mb.on('after-show', () => {
	mb.window.focus();
	checkForUpdate();
});

let appLauncher = new AutoLaunch({
	name: 'Oversetter',
	mac: {
		useLaunchAgent: true,
	}
});

/**
 * Show application window
 */
function showApp() {
	if (mb.window.isVisible())
		mb.hideWindow();
	else {
		mb.showWindow();
		mb.window.focus();
	}
}

/**
 * Check for the new version
 */
function checkForUpdate() {
	superagent.get(packageJson).end((error, response) => {
		const actualVersion = JSON.parse(response.text).version;
		console.log('Actual app version: ' + actualVersion + '. Current app version: ' + currentVersion);
		if (semver.gt(actualVersion, currentVersion)) {
			mb.window.webContents.send('update-available');
			console.log('New version is available!');
		}
	});
}

appLauncher.isEnabled()
	.then(isEnabled => {
		if (isEnabled) return;
		appLauncher.enable();
	})
	.catch(err => console.error(err));

app.on('will-quit', () => {
	// unregister all shortcuts
	globalShortcut.unregisterAll();
});