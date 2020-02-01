'use strict';

const { BrowserWindow } = require('electron');
const path = require('path');

/**
 * Dictionary window parameters
 */
const WINDOW_PARAMS = {
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
};

class Dictionary {
    /** dictionary window initialization */
    window = null;

    /**
     * Class constructor
     */
    constructor() {
        this.window = this.createWindow();
    }

    /**
     * Creates new window
     */
    createWindow() {
        const result = new BrowserWindow(WINDOW_PARAMS);
        // disable menu
        result.setMenu(null);
        // Load the template
        result.loadURL(`file:///${__dirname}/../index.html`);
        return result;
    }

    /**
     * Triggers on dictionary click from context menu.
     * Checks whether window is destroyed or not and creates new window or reuses already created instance
     */
    openDictionary() {
        // Prevent creating of new window
        if (this.window && !this.window.isDestroyed() && !this.window.isVisible()) {
            this.showWindow();
        } else if (this.window.isDestroyed()) {
            this.window = this.createWindow();
            this.window.once('ready-to-show', () => this.showWindow());
        }
    }

    /**
     * Shows already created window instance of the dictionary
     */
    showWindow() {
        this.window.show();
        this.window.webContents.send('open-dictionary');
    }
}

module.exports = Dictionary;
