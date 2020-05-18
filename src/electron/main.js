'use strict';

const { app, Menu, globalShortcut, ipcMain, Tray } = require('electron');
const { menubar } = require('menubar');
const AutoLaunch = require('auto-launch');
const semver = require('semver');
const superagent = require('superagent');
const path = require('path');
const settings = require('electron-settings');
const Dictionary = require('./dictionary');
const currentVersion = require('../package.json').version;

const packageJson = 'https://raw.githubusercontent.com/4gray/oversetter/master/package.json';

const keyboardShortcuts = {
    open: 'CommandOrControl+Alt+T',
    translateClipboard: 'CommandOrControl+Alt+R',
};

let mb, dictionary;
let appHeight = 315;

if (process.platform !== 'darwin') {
    appHeight = 298;
}

/**
 * Creates tray menu
 */
function createContextMenu() {
    return Menu.buildFromTemplate([
        {
            label: 'Translate',
            click: () => showApp(),
        },
        {
            label: 'Dictionary',
            click: () => {
                dictionary.openDictionary();
            },
        },
        {
            label: 'Preferences',
            click: () => {
                mb.window.webContents.send('show-settings');
                showApp();
            },
        },
        {
            type: 'separator',
        },
        {
            label: 'Restart App',
            click: () => {
                mb.app.quit();
                mb.app.relaunch();
            },
        },
        { label: 'Quit', click: () => app.quit() },
    ]);
}

app.on('ready', () => {
    const iconPath = path.join(__dirname, '/../assets/LightIconTemplate.png');
    const contextMenu = createContextMenu();
    const tray = new Tray(iconPath);
    dictionary = new Dictionary();

    const getAlwaysOnTopValue = () => {
        if (settings.has('alwaysOnTop')) return settings.get('alwaysOnTop') || false;
    };

    const getShowDockIconValue = () => {
        if (settings.has('showDockIcon')) return settings.get('showDockIcon') || false;
    };

    const getAutoLaunchValue = () => {
        if (settings.has('autolaunch')) return settings.get('autolaunch') || false;
    };

    const dockIcon = getShowDockIconValue();
    const alwaysOnTop = getAlwaysOnTopValue();
    const autoLaunch = getAutoLaunchValue();

    const browserWindow = {
        width: 500,
        height: appHeight,
        alwaysOnTop: alwaysOnTop,
        webPreferences: {
            nodeIntegration: true,
            backgroundThrottling: false,
        },
        resizable: false,
    };

    tray.setContextMenu(contextMenu);
    mb = menubar({
        tray,
        icon: iconPath,
        index: 'file://' + __dirname + '/../index.html',
        browserWindow,
        resizable: false,
        preloadWindow: true,
        transparent: true,
        frame: false,
        showDockIcon: dockIcon,
        show: false,
        'auto-hide-menu-bar': true,
    });

    mb.on('ready', () => {
        if (process.env.NODE_ENV === 'dev') mb.window.openDevTools();

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

        ipcMain.on('settings-update', (event, arg) => {
            console.log('Auto launch enabled: ' + arg.autolaunch);
            console.log('AlwaysOnTop enabled: ' + arg.alwaysOnTop);
            console.log('ShowDockIcon enabled: ' + arg.showDockIcon);
            settings.set('autolaunch', arg.autolaunch);
            settings.set('alwaysOnTop', arg.alwaysOnTop);
            settings.set('showDockIcon', arg.showDockIcon);
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

    setAutoLaunch(autoLaunch);
});

/** Unregister all shortcuts on quit */
app.on('will-quit', () => globalShortcut.unregisterAll());

/**
 * Set auto launch option
 */
function setAutoLaunch(autoLaunchValue) {
    const appLauncher = new AutoLaunch({
        name: 'Oversetter',
        mac: {
            useLaunchAgent: true,
        },
    });

    autoLaunchValue ? appLauncher.enable() : appLauncher.disable();
}

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
