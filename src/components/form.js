import { makeFormGroupC } from './form-group.js'
import { makeInputC } from './input.js'
import { makeFileInputC } from './input__file.js'
import { makeButtonC } from './button.js'

export const FORM_ITEM_TYPE_MAP = new Map([
  ['FormGroup', makeFormGroupC],
  ['Input', makeInputC],
  ['FileInput', makeFileInputC],
  ['Button', makeButtonC]
])
