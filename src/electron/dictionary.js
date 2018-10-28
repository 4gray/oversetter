'use strict';

const Electron = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');

class Dictionary {

    constructor() {}

    showWindow() {

        let mainWindowState = windowStateKeeper({
            defaultWidth: 600,
            defaultHeight: 500
        });

        // Prevent creating of new window
        if (this.window && this.window.isDestroyed() === false) {
            this.window.show();
        } else {
            this.window = new Electron.BrowserWindow({
                icon: path.join(__dirname, '../assets/icon.png'),
                resizable: true,
                center: true,
                minimizable: true,
                maximizable: true,
                title: 'Dictionary',
                show: false,
                x: mainWindowState.x,
                y: mainWindowState.y,
                width: mainWindowState.width,
                height: mainWindowState.height,
                minHeight: 400,
                minWidth: 500,
                showDockIcon: true,
                titleBarStyle: 'hiddenInset'
            });

            this.window.dialog = 'dictionary';
        }

        // Load the template
        this.window.loadURL(`file:///${__dirname}/../index.html`);
        this.window.once('ready-to-show', () => this.window.show());
        mainWindowState.manage(this.window);
    }
}

module.exports = Dictionary;