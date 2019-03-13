<p align="center">
  <img src="https://4gray.github.io/oversetter/assets/icon.png" alt="App Icon" width="256">
</p>


<p align="center">
  <a href="https://github.com/4gray/oversetter/releases"><img src="https://img.shields.io/github/release/4gray/oversetter.svg?style=flat-square" alt="Release"></a>
  <a href="https://github.com/4gray/oversetter/releases"><img src="https://img.shields.io/github/downloads/4gray/oversetter/total.svg?style=flat-square" alt="Downloads" /></a>
  <a href="https://github.com/4gray/oversetter"><img src="https://img.shields.io/travis/4gray/oversetter.svg?style=flat-square" alt="Downloads" /></a>
</p>


Oversetter is an translation app, which allows you to translate content directly from your menu bar. Oversetter is open-source application based on [Angular](https://angular.io/) and [Electron](http://electron.atom.io/). It uses free API of [Yandex Translate](https://tech.yandex.com/translate/) for text translation. 

# Screenshot

<p align="center">
  <img src="https://4gray.github.io/oversetter/assets/screenshot-1.png" alt="App Preview">
</p>

# Download

You can download the latest version of the application for [macOS](https://github.com/4gray/oversetter/releases), [Windows](https://github.com/4gray/oversetter/releases) and [Linux](https://github.com/4gray/oversetter/releases).

Oversetter is also available as [snap](https://snapcraft.io/oversetter) package: 
```
sudo snap install oversetter
```

# How to use

1. [Register](https://tech.yandex.com/translate/) free Yandex Translate API-Key (or use built-in dev-key for the first time).
2. Install dependencies, build and run application with electron:

```
npm install
npm run build
npm run electron
```

### Development
```
npm run build-dev
```
and
```
NODE_ENV=dev npm run electron
```

# App Packaging

```
npm run package:osx
npm run package:win32
npm run package:linux
```
or
```
npm run package:all
```
# ToDo: Up next

See [Projects](https://github.com/4gray/oversetter/projects/1)-tab.
Feel free to contribute!
