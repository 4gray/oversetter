const {app, BrowserWindow, ipcMain, Tray, nativeImage, shell, Menu} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let tray = undefined
let window = undefined

//app.dock.hide()

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
  // Setup the menubar with an icon
  //let icon = nativeImage.createFromDataURL(base64Icon)
  tray = new Tray(__dirname + '/IconTemplate.png')

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', function(event) {
    toggleWindow();
    //window.openDevTools({mode: 'detach'})

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })

  // Make the popup window for the menubar
  window = new BrowserWindow({
    width: 500,
    height: 325,
    resizable: false,
    preloadWindow: true,
    transparent: true,
    show: false,
    frame: false
    //alwaysOnTop: true
  })

  // Tell the popup window to load our index.html file
  window.loadURL(`file://${__dirname}/index.html`)

  window.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  })

  // Only close the window on blur if dev tools isn't opened
  window.on('blur', () => {
    if(!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })


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

})

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const trayPos = tray.getBounds()
  const windowPos = window.getBounds()
  let x, y = 0
  if (process.platform == 'darwin') {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height)
  } else {
    x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
    y = Math.round(trayPos.y + trayPos.height * 10)
  }

  window.setPosition(x, y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})
