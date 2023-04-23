//將數字轉換成帶有單位的數字
function getNumberWithUnit (number) {
  if (number >= 1000000000) {
    return `${Math.round((number/1000000000)*100)/100} GB`
  } else if (number >= 1000000) {
    return `${Math.round((number/1000000)*100)/100} MB`
  } else if (number >= 1000) {
    return `${Math.round((number/1000)*100)/100} KB`
  } else {
    return `${number} Bytes`
  }
}

export default (vMemoryUse, vMemoryCanUse) => {
  let a = 0

  let string = `[錯誤]: 使用的虛擬憶體超出上限 (${getNumberWithUnit(vMemoryUse)} / ${getNumberWithUnit(vMemoryCanUse)})

擬記憶體使用狀態:
｜執行器: ${getNumberWithUnit(vMemoryUse)}
｜｜
`
  return string
}