const fs = require('fs-extra')
const path = require('path')
const md5File = require('md5-file')
const gzip = require('node-gzip').gzip

const DEFAULT_BRANCH = 'master'
const remoteUrl = `http://git.corp.imdada.cn/changhui/lightproxy/raw/${DEFAULT_BRANCH}/release/update/`
const macDir = 'mac/LightProxy.app/Contents/Resources'
const winDir = 'win-unpacked/resources'
const releaseDir = '../release'
const macPrefix = 'mac-'
const winPrefix = 'win-'
const asarName = 'app.asar'
let mac_md5
let win_md5

const pkgJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'))
const macAsarName = `${macPrefix}${pkgJSON.version}.asar__gzip`
const winAsarName = `${winPrefix}${pkgJSON.version}.asar__gzip`

const generateJson = () => {
  fs.ensureDirSync(path.join(__dirname, releaseDir, 'update'))

  let releaseJSON = {
    "version": pkgJSON.version,
    "date": new Date().toISOString()
  }
  if (mac_md5) {
    releaseJSON = {
      ...releaseJSON,
      mac_md5,
      mac_asar: remoteUrl + macAsarName
    }
  }

  if (win_md5) {
    releaseJSON = {
      ...releaseJSON,
      win_md5,
      win_asar: remoteUrl + winAsarName
    }
  }

  fs.writeFileSync(path.join(__dirname, releaseDir, 'update/release.json'), JSON.stringify(releaseJSON), 'utf-8')
  console.log('generate release/update/release.json')
}

const generateGzip = async (from, to) => {
  const fileBuffer = fs.readFileSync(from)
  const afterCompress = await gzip(fileBuffer)
  fs.writeFileSync(to, afterCompress)
}

const clearFile = () => {
  try {
    console.log('clear dir: ', path.join(__dirname, '../release/mac'))
    removeSync(path.join(__dirname, '../release/mac'))
  } catch (e) {}
}

if (fs.pathExistsSync(path.join(__dirname, releaseDir))) {

    fs.ensureDirSync(path.join(__dirname, releaseDir, 'update'))
    const macAsarDir = path.join(__dirname, releaseDir, macDir, asarName)
    const winAsarDir = path.join(__dirname, releaseDir, winDir, asarName)

    if (fs.pathExistsSync(macAsarDir)) {
        const macDistDir = path.join(__dirname, releaseDir, 'update', macAsarName)
        mac_md5 = md5File.sync(macAsarDir)
        generateGzip(macAsarDir, macDistDir)
        fs.copySync(macAsarDir, path.join(__dirname, releaseDir, 'update', `${macPrefix}${pkgJSON.version}.asar`))
    }

    if (fs.pathExistsSync(winAsarDir)) {
        const winDistDir = path.join(__dirname, releaseDir, 'update', winAsarName)
        win_md5 = md5File.sync(winAsarDir)
        generateGzip(winAsarDir, winDistDir)
    }

    generateJson()

    clearFile()
} else {
    console.log('dir release not found, cannot generate asar file')
}
