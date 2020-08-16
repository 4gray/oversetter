<p align="center">
  <img src="https://4gray.github.io/oversetter/assets/icon.png" alt="App Icon" width="256">
</p>

<p align="center">
  <a href="https://github.com/4gray/oversetter/releases"><img src="https://img.shields.io/github/release/4gray/oversetter.svg?style=flat-square" alt="Release"></a>
  <a href="https://github.com/4gray/oversetter/releases"><img src="https://img.shields.io/github/downloads/4gray/oversetter/total.svg?style=flat-square" alt="Downloads" /></a>
  <a href="https://github.com/4gray/oversetter"><img src="https://img.shields.io/travis/4gray/oversetter.svg?style=flat-square" alt="Downloads" /></a>
</p>


Oversetter is an translation app, which allows you to translate content directly from your menu bar. Oversetter is an open-source project based on [Angular](https://angular.io/) and [Electron](http://electron.atom.io/). It uses free API of [Yandex Translate](https://tech.yandex.com/translate/) for text translation. 

## Features

* **93 languages** - Thanks to Yandex Translate API
* **Built-in dictionary** - Save words and phrases for later
* **Themes support** - Includes dark and light theme
* **Cross-platform support** - Available for MacOs, Linux and Windows
* **Fast and easy access** - Open Oversetter directly from the system tray
* **Offline mode** - Save and learn vocabulary also in offline mode

# Screenshots

<p align="center">
  <img src="https://4gray.github.io/oversetter/assets/screenshot-1.png" alt="App Preview">
  <br />Light theme
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1503032/90333120-4bb52180-dfc3-11ea-8d7f-3545ae548001.png" alt="Dark theme">
  <br />Dark theme
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/1503032/90333123-4c4db800-dfc3-11ea-90c8-123a86d15069.png" alt="Dictionary">
  <br />Dictionary
</p>

# Download

You can download the latest version of the application for [macOS](https://github.com/4gray/oversetter/releases), [Windows](https://github.com/4gray/oversetter/releases) and [Linux](https://github.com/4gray/oversetter/releases).

Oversetter is also available as [snap](https://snapcraft.io/oversetter) package: 
```
sudo snap install oversetter
```

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/oversetter)

# How to use

1. [Register](https://tech.yandex.com/translate/) free Yandex Translate API-Key (or use built-in dev-key for the first time).
2. Install dependencies, build and run application with electron:

```
npm install
npm run build
npm run run:electron
```

### Development
```
npm run build-dev
```
and
```
NODE_ENV=dev npm run run:electron
```

# App Packaging

```
npm run build:mac
npm run build:linux
npm run build:windows
npm run build:all
```
or
```
npm run package:all
```

# ToDo: Next steps

See [Projects](https://github.com/4gray/oversetter/projects/1)-tab.
Feel free to contribute!
