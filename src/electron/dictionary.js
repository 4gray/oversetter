'use strict';

const Electron = require('electron');
const path = require('path');

class Dictionary {
    window = null;

    constructor() {
        this.window = this.createWindow();
    }

    createWindow() {
        const result = new Electron.BrowserWindow({
            icon: path.join(__dirname, '../assets/icon.png'),
            resizable: true,
            center: true,
            minimizable: true,
            maximizable: true,
            title: 'Dictionary',
            show: false,
            height: 500,
            width: 600,
            minHeight: 400,
            minWidth: 500,
            modal: true,
            showDockIcon: true,
            titleBarStyle: 'hiddenInset',
            webPreferences: {
                nodeIntegration: true,
                backgroundThrottling: false
            }
        });

        // disable menu
        result.setMenu(null);

        // Load the template
        result.loadURL(`file:///${__dirname}/../index.html`);

        return result;
    }

    openDictionary() {
        // Prevent creating of new window
        if (this.window && !this.window.isDestroyed() && !this.window.isVisible()) {
            this.showWindow();
        } else if (this.window.isDestroyed()) {
            this.window = this.createWindow();
            this.window.once('ready-to-show', () => this.showWindow());
        }
    }

    showWindow() {
        this.window.show();
        this.window.webContents.send('open-dictionary');
    }
}

module.exports = Dictionary;
