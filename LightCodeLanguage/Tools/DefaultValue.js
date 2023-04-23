//預設的值 (將新的值套用在舊的值上)
export default (defaultValue, newValue) => {
  if (newValue === undefined) {
    return defaultValue
  } else {
    let allKey = Object.keys(defaultValue)
    allKey.map((item) => {
      if (typeof defaultValue[item] === 'object') newValue[item] = defaultValue(defaultValue[item], newValue[item])
      else if (newValue[item] === undefined) newValue[item] = defaultValue[item]
    })
    return newValue
  }
}