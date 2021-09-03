import { emptyDirSync, copyFileSync, rootResolvePath } from './utils.js'
import { getWebpackConfig } from '../webpack.config.js'
import webpack from 'webpack'
import path from 'path'
import fs, { readFileSync } from 'fs'
import ts from 'typescript'

const BUILD_MODE = 'release'
const BUILD_TARGET_DES = 'release'
const resolvePathInDes = (...paths) => path.join(BUILD_TARGET_DES, ...paths)

const empty = () => {
  return new Promise((resolve) => {
    emptyDirSync(rootResolvePath(BUILD_TARGET_DES))
    emptyDirSync(rootResolvePath('./typings'))
    resolve()
  })
}

const getTSConfigJSONString = () => readFileSync(rootResolvePath('./tsconfig.json'), { encoding: 'utf8' })
  .replace(/\s\/\*.*\*\//g, '')
  .replace(/\s\/\/.*,/g, '')
  .replace(/\s\/\*.*/g, '')
  .replace(/\s\*(.)*/g, '')
const getTSConfig = () => JSON.parse(getTSConfigJSONString())
const collectFiles = (rootPath, results = []) => {
  const files = fs.readdirSync(rootPath)
  files.forEach(item => {
    const filepath = path.resolve(rootPath, item)
    if (fs.statSync(filepath).isDirectory()) {
      results.push(...collectFiles(filepath))
    } else {
      results.push(filepath)
    }
  })
  return results
}

const packES = () => {
  return new Promise((resolve) => {
    const compilerOptions = getTSConfig().compilerOptions
    compilerOptions.incremental = false
    delete compilerOptions.tsBuildInfoFile
    compilerOptions.composite = false
    compilerOptions.target = ts.ScriptTarget.ES2015
    compilerOptions.module = ts.ModuleKind.ES2015
    compilerOptions.outDir = rootResolvePath('./release/modules/es')
    compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs
    delete compilerOptions.declarationDir

    const program = ts.createProgram([rootResolvePath('./src/main.ts')], compilerOptions)
    const emitResult = program.emit()

    const targetFiles = collectFiles(rootResolvePath('./src/ts'))
      .filter(filepath => filepath.endsWith('.js') || filepath.endsWith('.d.ts'))

    targetFiles.forEach(filepath => {
      const relativePathToSrc = path.relative(rootResolvePath('./src'), filepath)
      const relativePathToDest = path.relative(filepath, rootResolvePath('./release/modules/es'))
      copyFileSync(
        filepath,
        path.resolve(filepath, relativePathToDest, relativePathToSrc)
      )
    })

    console.log('【packES】 emitResult', emitResult)
    console.log('【packES】 source file copyed', targetFiles)
    resolve(emitResult)
  })
}

const packTypings = () => {
  return new Promise((resolve) => {
    const compilerOptions = getTSConfig().compilerOptions
    compilerOptions.emitDeclarationOnly = true
    compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs
    compilerOptions.declarationDir = rootResolvePath('./typings')

    const program = ts.createProgram([rootResolvePath('./src/main.ts')], compilerOptions)
    const emitResult = program.emit()

    const dtsFiles = collectFiles(rootResolvePath('./src/ts'))
      .filter(filepath => filepath.endsWith('.d.ts'))

    dtsFiles.forEach(filepath => {
      const relativePathToSrc = path.relative(rootResolvePath('./src'), filepath)
      const relativePathToDest = path.relative(filepath, rootResolvePath('./typings'))
      copyFileSync(
        filepath,
        path.resolve(filepath, relativePathToDest, relativePathToSrc)
      )
    })

    console.log('【packTypings】 emitResult', emitResult)
    console.log('【packTypings】 dts file copyed', dtsFiles)
    resolve(emitResult)
  })
}

const pack = () => {
  return new Promise((resolve) => {
    webpack(getWebpackConfig({ mode: BUILD_MODE }))
      .run((err, stats) => {
        // @see https://webpack.js.org/api/node/#error-handling
        if (err) {
          console.error(err.stack || err)
          if (err.details) {
            console.error(err.details)
          }
          return
        }

        const info = stats.toJson()

        if (stats.hasErrors()) {
          console.error(info.errors)
        }

        if (stats.hasWarnings()) {
          const warnings = info.warnings.filter(info => {
            const { message } = info
            return !message.startsWith('asset size limit:') && !message.startsWith('webpack performance recommendations:')
          })
          if (warnings.length > 0) {
            console.warn(warnings)
          }
        }

        resolve()
      })
  })
}

const complementModules = () => {
  return new Promise((resolve) => {
    console.log('[[complementModules]] start...')
    copyFileSync(
      rootResolvePath('release/modules/cjs/main.js'),
      rootResolvePath('release/modules/cjs/main.cjs')
    )
    copyFileSync(
      rootResolvePath('release/modules/umd/main.js'),
      rootResolvePath('release/modules/umd/main.cjs')
    )
    console.log('[[complementModules]] complete...')
  })
}

const copy = () => {
  return new Promise((resolve) => {
    console.log('【copy】 start...')
    copyFileSync(
      rootResolvePath('src/statics/images/thoughts-daily.png'),
      rootResolvePath(resolvePathInDes('statics/images/thoughts-daily.png'))
    )
    copyFileSync(
      rootResolvePath('src/statics/images/beian.png'),
      rootResolvePath(resolvePathInDes('statics/images/beian.png'))
    )
    copyFileSync(
      rootResolvePath('release/styles/css-base.css'),
      rootResolvePath('release/styles/css-base.wxss')
    )
    copyFileSync(
      rootResolvePath('release/styles/mobius-css.css'),
      rootResolvePath('release/styles/mobius-css.wxss')
    )
    copyFileSync(
      rootResolvePath('release/styles/css-addon.css'),
      rootResolvePath('release/styles/css-addon.wxss')
    )
    console.log('【copy】 complete!')
    // TODO: 清除 base.js & addons.js & mobius.js
    resolve()
  })
}

// execute
empty()
  .then(() => packES())
  .then(() => packTypings())
  .then(() => pack())
  .then(() => complementModules())
  .then(() => copy())
  .then(() => {
    console.log(`${BUILD_MODE} Build Complete!!!`)
  })
