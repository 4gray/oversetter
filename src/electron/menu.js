const { remote } = require('electron');
const { Menu, MenuItem } = remote;

const menu = new Menu();

menu.append(new MenuItem({
    label: "Cut",
    accelerator: "CmdOrCtrl+X",
    role: "cut"
}));

menu.append(new MenuItem({
    label: "Copy",
    accelerator: "CmdOrCtrl+C",
    role: "copy"
}));

menu.append(new MenuItem({
    label: "Paste",
    accelerator: "CmdOrCtrl+V",
    role: "paste"
}));

menu.append(new MenuItem({
    label: "Select All",
    accelerator: "CmdOrCtrl+A",
    role: "selectall"
}));

window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    menu.popup(remote.getCurrentWindow());
}, false);