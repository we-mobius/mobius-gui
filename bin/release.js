const fs = require('fs')
const path = require('path')

function copyFile (src, des) {
  const srcPath = path.resolve(__dirname, '../', src)
  const desPath = path.resolve(__dirname, '../', des)
  fs.copyFileSync(srcPath, desPath)
  // fs.createReadStream(srcPath).pipe(fs.createWriteStream(desPath))
}

copyFile('./release/styles/mobius.css', './release/styles/mobius.wxss')
copyFile('./release/styles/addons.css', './release/styles/addons.wxss')
