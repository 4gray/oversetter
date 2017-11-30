'use strict';

const { app, Menu, globalShortcut, ipcMain } = require('electron');
const menubar = require('menubar');
const AutoLaunch = require('auto-launch');
const semver = require('semver');
const superagent = require('superagent');
const path = require('path');
const settings = require('electron-settings');
const About = require('./about');
const Dictionary = require('./dictionary');

const packageJson = 'https://raw.githubusercontent.com/4gray/oversetter/master/package.json';
const currentVersion = app.getVersion();
let aboutWindow = new About();
let dictionary = new Dictionary();

const keyboardShortcuts = {
    open: 'CommandOrControl+Alt+T',
    translateClipboard: 'CommandOrControl+Alt+R'
};

let appHeight = 315;
let dockIcon = getShowDockIconValue();
let alwaysOnTop = getAlwaysOnTopValue();
let autolaunch = getAutoLaunchValue();

if (process.platform !== 'darwin') {
    appHeight = 298;
}

const mb = menubar({
    icon: path.join(__dirname, '/../LightIconTemplate.png'),
    index: 'file://' + __dirname + '/index.html',
    width: 500,
    height: appHeight,
    resizable: false,
    preloadWindow: true,
    transparent: true,
    frame: false,
    showDockIcon: dockIcon,
    show: false,
    alwaysOnTop: alwaysOnTop
});

mb.on('ready', () => {

    if (process.env.NODE_ENV === 'dev')
        mb.window.openDevTools();

    if (process.platform === 'linux') {
        mb.tray.setToolTip('Translate');
        mb.window.setResizable(false); // workaround for linux
    }

    // create the application's main menu // TODO: refactor
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
    }];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    // register show window shortcut listener
    globalShortcut.register(keyboardShortcuts.open, () => {
        mb.window.webContents.send('translate');
        showApp();
    });

    // register global shortcut for clipboard text translation
    globalShortcut.register(keyboardShortcuts.translateClipboard, () => {
        mb.window.webContents.send('translate-clipboard');
        showApp();
    });

    ipcMain.on('autolaunch', (event, arg) => {
        console.log('Autolaunch enabled: ' + arg);
        settings.set('autolaunch', arg);
    });

    ipcMain.on('alwaysOnTop', (event, arg) => {
        console.log('AlwaysOnTop enabled: ' + arg);
        settings.set('alwaysOnTop', arg);
    });

    ipcMain.on('showDockIcon', (event, arg) => {
        console.log('ShowDockIcon enabled: ' + arg);
        settings.set('showDockIcon', arg);
    });


});

/**
 * Menu dialog on the right click
 */
mb.on('after-create-window', function() {
    const contextMenu = Menu.buildFromTemplate([
        { label: 'About Oversetter', click: () => aboutWindow.showWindow() },
        { label: 'Open dictionary', click: () => dictionary.showWindow() },
        {
            label: 'Preferences',
            click: () => {
                mb.window.webContents.send('show-settings');
                showApp();
            }
        },
        {
            label: 'Restart App',
            click: () => {
                mb.app.quit();
                mb.app.relaunch();
            }
        }, // TODO: add check for updates option
        { type: 'separator' },
        { label: 'Quit', click: () => { mb.app.quit(); } }
    ]);
    mb.tray.on('right-click', () => {
        mb.tray.popUpContextMenu(contextMenu);
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


if (autolaunch)
    appLauncher.enable();
else
    appLauncher.disable();


app.on('will-quit', () => {
    // unregister all shortcuts
    globalShortcut.unregisterAll();
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
        if (error) return;
        const actualVersion = JSON.parse(response.text).version; // TODO: case without internet connection
        console.log('Actual app version: ' + actualVersion + '. Current app version: ' + currentVersion);
        if (semver.gt(actualVersion, currentVersion)) {
            mb.window.webContents.send('update-available');
            console.log('New version is available!');
        }
    });
}

function getAlwaysOnTopValue() {
    if (settings.has('alwaysOnTop'))
        return settings.get('alwaysOnTop');
    else
        return false;
}

function getShowDockIconValue() {
    if (settings.has('showDockIcon'))
        return settings.get('showDockIcon');
    else
        return false
}

function getAutoLaunchValue() {
    if (settings.has('autolaunch'))
        return settings.get('autolaunch');
    else
        return false;
}