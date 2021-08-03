import { useFormGroupTC } from './form-group.js'
import { useInputTC } from './input.js'
import { useFileInputTC } from './input__file.js'
import { useButtonTC } from './button.js'

/**
 * 这里使用 `['FormGroup', (tacheOptions = options) => useFormGroupTC(tacheOptions)]`，
 * 而非 `['FormGroup', useFormGroupTC({})]` 的原因有二：
 *
 *  1. FormGroup 与 Button 等其它组件一致，可以作为 FormGroup 的管理目标，
 *     因此，代码中存在相互引用，`form.js` 与 `form-froup.js` 相互引用，
 *     这种情况下使用 `['FormGroup', useFormGroupTC({})]` 会导致代码初始化失败，
 *     错误信息为：`Uncaught ReferenceError: Cannot access 'useFormGroupTC' before initialization`
 *  2. useFormGroupTC 第一个参数为 tacheOptions，第二种方式将该参数硬编码在字典中，降低了灵活性。
 */

/**
 *
 */
const createItem = c => (tacheOptions = {}) => c(tacheOptions)

/**
 *
 */
export const FORM_ITEM_MAP = new Map([
  // ! `createItem(useFormGroupTC)` 也会导致引用错误
  ['FormGroup', (tacheOptions = {}) => useFormGroupTC(tacheOptions)],
  ['Input', createItem(useInputTC)],
  ['FileInput', createItem(useFileInputTC)],
  ['Button', createItem(useButtonTC)]
])
