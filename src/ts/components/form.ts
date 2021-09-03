import { useFormGroupDC } from './form-group'
import { useInputTC } from './input'
import { useFileInputDC } from './input__file'
import { useButtonDC } from './button'

/**
 * 这里使用 `['FormGroup', (tacheOptions = options) => useFormGroupDC(tacheOptions)]`，
 * 而非 `['FormGroup', useFormGroupDC({})]` 的原因有二：
 *
 *  1. FormGroup 与 Button 等其它组件一致，可以作为 FormGroup 的管理目标，
 *     因此，代码中存在相互引用，`form.js` 与 `form-froup.js` 相互引用，
 *     这种情况下使用 `['FormGroup', useFormGroupDC({})]` 会导致代码初始化失败，
 *     错误信息为：`Uncaught ReferenceError: Cannot access 'useFormGroupDC' before initialization`
 *  2. useFormGroupDC 第一个参数为 tacheOptions，第二种方式将该参数硬编码在字典中，降低了灵活性。
 */

/**
 *
 */
const createItem = c => (tacheOptions = {}) => c(tacheOptions)

/**
 *
 */
export const FORM_ITEM_MAP = new Map([
  // ! `createItem(useFormGroupDC)` 也会导致引用错误
  ['FormGroup', (tacheOptions = {}) => useFormGroupDC(tacheOptions)],
  // ['Input', createItem(useInputTC)],
  ['FileInput', createItem(useFileInputDC)],
  ['Button', createItem(useButtonDC)]
])

export const registerFormItem = (name, componentFactory) => {
  if (FORM_ITEM_MAP.get(name) != null) {
    throw (new Error(`"${name}" is existed in "FORM_ITEM_APP".`))
  } else {
    FORM_ITEM_MAP.set(name, createItem(componentFactory))
  }
}
