'use strict';

const Electron = require('electron');

class About {

    constructor() { }

    showWindow() {
        // Prevent creating of new window
        if (this.window && this.window.isDestroyed() === false) {
            this.window.show();
        } else {
            this.window = new Electron.BrowserWindow({
                resizable: false,
                center: true,
                minimizable: false,
                maximizable: false,
                title: 'About Oversetter',
                show: false,
                height: 330,
                width: 300
            });

            this.window.dialog = 'about';
            this.window.version = Electron.app.getVersion();
        }

        // Load the template
        this.window.loadURL(`file:///${__dirname}/../index.html`);
        this.window.once('ready-to-show', () => this.window.show());
    }
}

module.exports = About;