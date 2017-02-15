'use strict';

const {app, BrowserWindow, ipcMain, Tray, nativeImage, shell, Menu} = require('electron');
const menubar = require('menubar');

let tray = null;

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {

	const mb = menubar({
		index: 'file://' + __dirname + '/index.html',
		width: 500,
		height: 325,
		resizable: false,
		preloadWindow: true,
		transparent: true,
		show: false,
		frame: false,
		showDockIcon: false
	});

	//mb.window.openDevTools();

	// Create the Application's main menu
	var template = [{
		label: "Application",
		submenu: [
			{ label: "About Application", role: "orderFrontStandardAboutPanel" },
			{ type: "separator" },
			{ label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
		]}, {
		label: "Edit",
		submenu: [
			{ label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
			{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
			{ type: "separator" },
			{ label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
			{ label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
			{ label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
			{ label: "Select All", accelerator: "CmdOrCtrl+A", role: "selectall" }
		]}
	];

	Menu.setApplicationMenu(Menu.buildFromTemplate(template));

});

