import { useFormGroupTC } from './form-group.js'
import { useInputTC } from './input.js'
import { useFileInputTC } from './input__file.js'
import { useButtonTC } from './button.js'

export const FORM_ITEM_TYPE_MAP = new Map([
  ['FormGroup', useFormGroupTC({})],
  ['Input', useInputTC({})],
  ['FileInput', useFileInputTC({})],
  ['Button', useButtonTC({})]
])
