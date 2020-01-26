'use strict';

const { app, Menu, globalShortcut, ipcMain, Tray } = require('electron');
const { menubar } = require('menubar');
const AutoLaunch = require('auto-launch');
const semver = require('semver');
const superagent = require('superagent');
const path = require('path');
const settings = require('electron-settings');
const Dictionary = require('./dictionary');

const packageJson = 'https://raw.githubusercontent.com/4gray/oversetter/master/package.json';
const currentVersion = app.getVersion();
const dictionary = new Dictionary();

const keyboardShortcuts = {
    open: 'CommandOrControl+Alt+T',
    translateClipboard: 'CommandOrControl+Alt+R'
};

let mb;
let appHeight = 315;

if (process.platform !== 'darwin') {
    appHeight = 298;
}

function createContextMenu() {
    return Menu.buildFromTemplate([
        {
            label: 'Translate',
            type: 'radio',
            click: () => showApp()
        },
        { label: 'Dictionary', type: 'radio', click: () => dictionary.showWindow() },
        {
            label: 'Preferences',
            type: 'radio',
            click: () => {
                mb.window.webContents.send('show-settings');
                showApp();
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Restart App',
            click: () => {
                mb.app.quit();
                mb.app.relaunch();
            }
        }, // TODO: add check for updates option
        { label: 'Quit', type: 'radio', click: () => app.quit() }
    ]);
}

app.on('ready', () => {
    const iconPath = path.join(__dirname, '/../assets/LightIconTemplate.png');
    const contextMenu = createContextMenu();
    const tray = new Tray(iconPath);

    const getAlwaysOnTopValue = () => {
        if (settings.has('alwaysOnTop')) return settings.get('alwaysOnTop') || false;
    };

    const getShowDockIconValue = () => {
        if (settings.has('showDockIcon')) return settings.get('showDockIcon') || false;
    };

    const getAutoLaunchValue = () => {
        if (settings.has('autolaunch')) return settings.get('autolaunch') || false;
    };

    let dockIcon = getShowDockIconValue();
    let alwaysOnTop = getAlwaysOnTopValue();
    let autolaunch = getAutoLaunchValue();

    tray.setContextMenu(contextMenu);
    mb = menubar({
        tray,
        icon: iconPath,
        index: 'file://' + __dirname + '/../index.html',
        browserWindow: {
            width: 500,
            height: appHeight,
            alwaysOnTop: alwaysOnTop,
            webPreferences: {
                nodeIntegration: true,
                backgroundThrottling: false
            },
            resizable: false
        },
        resizable: false,
        preloadWindow: true,
        transparent: true,
        frame: false,
        showDockIcon: dockIcon,
        show: false,
        'auto-hide-menu-bar': true
    });

    mb.on('ready', () => {
        if (process.env.NODE_ENV === 'dev') mb.window.openDevTools();

        // create the application's main menu // TODO: refactor
        const template = [
            {
                label: 'Menu',
                submenu: [
                    {
                        label: 'Hide',
                        accelerator: 'Esc',
                        click: () => mb.window.hide()
                    },
                    {
                        label: 'Cut',
                        accelerator: 'CmdOrCtrl+X',
                        role: 'cut'
                    },
                    {
                        label: 'Copy',
                        accelerator: 'CmdOrCtrl+C',
                        role: 'copy'
                    },
                    {
                        label: 'Paste',
                        accelerator: 'CmdOrCtrl+V',
                        role: 'paste'
                    },
                    {
                        label: 'Select All',
                        accelerator: 'CmdOrCtrl+A',
                        role: 'selectall'
                    },
                    {
                        label: 'Toggle Developer Tools',
                        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                        click(item, focusedWindow) {
                            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
                        }
                    },
                    {
                        label: 'Quit',
                        accelerator: 'Command+Q',
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

        ipcMain.on('openDictionary', () => {
            dictionary.showWindow();
        });
    });

    /**
     * Opens context menu on trays right click
     */
    tray.on('right-click', () => {
        mb.tray.popUpContextMenu(contextMenu);
    });

    mb.on('after-show', () => {
        mb.window.focus();
        checkForUpdate();
    });

    let appLauncher = new AutoLaunch({
        name: 'Oversetter',
        mac: {
            useLaunchAgent: true
        }
    });

    autolaunch ? appLauncher.enable() : appLauncher.disable();
});

app.on('will-quit', () => {
    // unregister all shortcuts
    globalShortcut.unregisterAll();
});

/**
 * Show application window
 */
function showApp() {
    if (mb.window.isVisible()) mb.hideWindow();
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
