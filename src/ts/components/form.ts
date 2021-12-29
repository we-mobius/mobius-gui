import { useFormGroupDC } from './form-group'
import { useInputDC } from './input'
import { useFileInputDC } from './input__file'
import { useButtonDC } from './button'

import type { FormGroupDCType } from './form-group'
import type { FileInputElementType } from '../elements/input__file'
import type { ButtonElementType } from '../elements/button'

import type { IPartialUseGUIDriver_ } from '../helpers/index'

/**
 * 这里使用 `['FormGroup', (tacheOptions = options) => useFormGroupDC(tacheOptions)]`，
 * 而非 `['FormGroup', useFormGroupDC({})]` 的原因有二：
 *
 *  1. FormGroup 与 Button 等其它组件一致，可以作为 FormGroup 的管理目标，
 *     因此，代码中存在相互引用，`form.ts` 与 `form-froup.ts` 相互引用，
 *     这种情况下使用 `['FormGroup', useFormGroupDC({})]` 会导致代码初始化失败，
 *     错误信息为：`Uncaught ReferenceError: Cannot access 'useFormGroupDC' before initialization`
 *  2. useFormGroupDC 第一个参数为 tacheOptions，第二种方式将该参数硬编码在字典中，降低了灵活性。
 */

/**
 *
 */
const createFormMember = (guiDriverUse: IPartialUseGUIDriver_) => (tacheOptions = {}) => guiDriverUse(tacheOptions)

/**
 *
 */
export const FORM_MEMBERS_MAP = new Map([
  // ! `createItem(useFormGroupDC)` 也会导致引用错误
  ['FormGroup', (tacheOptions = {}) => useFormGroupDC(tacheOptions)],
  // ['Input', createItem(useInputDC)],
  ['FileInput', createFormMember(useFileInputDC)],
  ['Button', createFormMember(useButtonDC)]
])

export const registerFormMember = (name: string, guiDriverUse: IPartialUseGUIDriver_): void => {
  if (FORM_MEMBERS_MAP.get(name) != null) {
    throw (new Error(`"${name}" is existed in "FORM_ITEM_APP".`))
  } else {
    FORM_MEMBERS_MAP.set(name, createFormMember(guiDriverUse))
  }
}
