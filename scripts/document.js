import { rootResolvePath } from './utils.js'
import { readFileSync } from 'fs'
import { TSConfigReader, Application as TypeDocApplication } from 'typedoc'

/**
 * Strongly refers: https://github.com/TypeStrong/typedoc/issues/1403.
 */

/**
 * Get tsconfig.json string and remove comments.
 */
const getTypeDocConfigJSONString = () => readFileSync(rootResolvePath('./typedoc.json'), { encoding: 'utf8' })
const getTypeDocConfig = () => JSON.parse(getTypeDocConfigJSONString())

export const createTypeScriptApiDocs = (typeDocOptions) => {
  const app = new TypeDocApplication()
  app.options.addReader(new TSConfigReader())

  const typeDocConfig = getTypeDocConfig()

  app.bootstrap({
    ...typeDocConfig,
    ...typeDocOptions
  })

  // This is the part that seems to skip compile errors
  // (normally we would call `app.convert()` here)
  const project = app.converter.convert(app.getEntryPoints() ?? [])

  if (!project) {
    throw new Error(`Error creating the TypeScript API docs for ${typeDocConfig.entryPoints}.`)
  }

  app.generateDocs(project, typeDocConfig.out)
}

createTypeScriptApiDocs()
