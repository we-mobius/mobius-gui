import { cwd } from 'process'
import path from 'path'
import fs from 'fs'

export const ROOT = cwd()
export const rootResolvePath = (...paths) => path.resolve(ROOT, ...paths)
export const getDirname = targetPath => path.dirname(targetPath)

export const emptyDirSync = dir => fs.rmdirSync(dir, { recursive: true })
export const ensureDirSync = dir => fs.mkdirSync(dir, { recursive: true })

export const copyFileSync = (src, des) => {
  ensureDirSync(getDirname(des))
  fs.copyFileSync(src, des)
}
