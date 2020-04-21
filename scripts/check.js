const md5File = require('md5-file');
const nodepath = require('path');
// const fs = require('fs-extra');
// const ungzip = require('node-gzip').ungzip;

const LIGHTPROXY_HOME_PATH = '/Users/changhui/Library/Application Support/LightProxy';
// const LIGHTPROXY_HOME_PATH = '../release'
// const LIGHTPROXY_UPDATE_DIR = nodepath.join(__dirname, LIGHTPROXY_HOME_PATH, 'update');
const LIGHTPROXY_UPDATE_DIR = nodepath.join(LIGHTPROXY_HOME_PATH, 'update');
// const LIGHTPROXY_UPDATE_CONFIG = nodepath.join(LIGHTPROXY_UPDATE_DIR, 'release.json');

// const ASARZIP = nodepath.join(LIGHTPROXY_UPDATE_DIR, 'mac-0.0.1.asar__gzip')
const ASAR = nodepath.join(LIGHTPROXY_UPDATE_DIR, 'mac-0.0.3.asar');

// console.log('file path: ', LIGHTPROXY_UPDATE_CONFIG)
// const info = JSON.parse(fs.readFileSync(LIGHTPROXY_UPDATE_CONFIG, 'utf-8'));
// const { mac_md5 } = info;

// console.log('md5:', mac_md5);
// console.log('path: ', path);

// const uncompress = async () => {
//   return await ungzip(fs.readFileSync(ASARZIP))
// }
// uncompress().then(res => {
// fs.writeFileSync(ASAR, res);
// console.log('sync: ', md5File.sync(ASAR));
// })

console.log('sync: ', md5File.sync(ASAR));
