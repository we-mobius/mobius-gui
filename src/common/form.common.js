import {
  isString, isBoolean, isObject, isArray, hasOwnProperty, asIs,
  allPass,
  trim,
  isPhoneNum,
  deepCopy,
  composeL
} from '../libs/mobius-utils.js'
import { shareReplay, map, take, partition } from '../libs/rx.js'

// 数据结构判断
export const isValidityObj = allPass([isObject, hasOwnProperty('isValid'), hasOwnProperty('details')])

// 表单项值验证器
export const makeValidator = test => value => ({
  isValid: test(value),
  details: []
})
export const notEmpty = v => !!trim(v)
export const isPhoneNumV = makeValidator(isPhoneNum)
export const notEmptyV = makeValidator(notEmpty)

// 表单运行时辅助函数
export const initFormConfig = (config, initializer = asIs) => {
  const newConfig = deepCopy(config)
  return initializer(newConfig) || newConfig
}
export const initializerDict = name => {
  const _dict = {
    initialValue: initialValueInitializer,
    validateOnce: validateOnceInitializer
  }
  return _dict[name] || asIs
}
export const withInitializer = (...initializers) => composeL(...initializers.map(initializer => {
  if (isString(initializer)) {
    initializer = initializerDict(initializer)
  }
  return initializer
}))
export const initialValueInitializer = config => {
  Object.values(config).forEach((itemConfig) => {
    itemConfig.initialValue = hasOwnProperty('initialValue', itemConfig) ? itemConfig.initialValue : itemConfig.value
  })
  return config
}
export const validateOnceInitializer = config => {
  Object.values(config).forEach(itemConfig => {
    itemConfig.validity = validateItem(itemConfig, itemConfig)
  })
  return config
}

export const validateItem = (itemConfig, incomeConfig) => {
  return itemConfig.validators.reduce((itemValidity, validator) => {
    const [handler, trueDetails, falseDetails] = validator
    let validity = handler(incomeConfig.value)
    // validator 函数可以直接返回 布尔值
    if (isBoolean(validity)) {
      validity = {
        isValid: validity,
        details: []
      }
    }
    const extraDetails = (validity.isValid === true ? trueDetails : falseDetails) || []
    if (isValidityObj(extraDetails)) {
      validity.details = validity.details.concat(extraDetails.details)
    } else if (isArray(extraDetails)) {
      validity.details = validity.details.concat(extraDetails)
    } else if (isObject(extraDetails)) {
      validity.details.push(extraDetails)
    }
    return {
      isValid: itemValidity.isValid && validity.isValid,
      details: itemValidity.details.concat(validity.details)
    }
  }, { isValid: true, details: [] })
}

export const isValidFormData = formConfig => Object.values(formConfig).every(formItemConfig => formItemConfig.validity.isValid)

export const makeValidityObservables = (formConfig$, formDataValiditor) => {
  const validity$ = formConfig$.pipe(map(formDataValiditor || isValidFormData))
  const validityShare$ = validity$.pipe(shareReplay(1))
  const validityOnce$ = validityShare$.pipe(take(1))
  const [valid$, invalid$] = validityShare$.pipe(partition(v => !!v))

  return {
    raw: validity$,
    share: validityShare$,
    once: validityOnce$,
    valid: valid$,
    invalid: invalid$
  }
}

export const extractValues = formConfig => Object.keys(formConfig).reduce((postformData, curItemName) => {
  postformData[curItemName] = formConfig[curItemName].value
  return postformData
}, {})
