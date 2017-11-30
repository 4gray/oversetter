'use strict';

const Electron = require('electron');

class Dictionary {

    constructor() {}

    showWindow() {
        // Prevent creating of new window
        if (this.window && this.window.isDestroyed() === false) {
            this.window.show();
        } else {
            this.window = new Electron.BrowserWindow({
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
                showDockIcon: true,
                titleBarStyle: 'hiddenInset'
            });

            this.window.dialog = 'dictionary';
        }

        // Load the template
        this.window.loadURL(`file:///${__dirname}/index.html`);
        this.window.once('ready-to-show', () => this.window.show());
    }
}

module.exports = Dictionary;