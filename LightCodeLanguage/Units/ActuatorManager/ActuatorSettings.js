//預設的執行器設定
const defaultSettings = {
  //效能設定
  cpe: 100, //Chunk Per Execution
  vMemCanUse: Infinity, //Virtual Memory Can Used
  interval: 1,
  maxChunks: Infinity,
  maxCallLength: 100,
  //輸出設定
  logToConsole: true,
  saveLog: false,
  actuatorLog: false,
  detailedError: false,
  //其他設定
  vDiskPath: ''
}

export { defaultSettings, checkSettings }

//檢查設定 (確認每個設定的值都符合標準)
function checkSettings (settings) {
  if (typeof settings.cpe !== 'number' || settings.cpe < 1) throw new Error('[LCL]: 設定 cpe 只能為一個 <數字> 且大於 0')
  else if (typeof settings.vMemCanUse !== 'number' || settings.vMemCanUse < 1) throw new Error('[LCL]: 設定 vMemCanUse 只能為一個 <數字> 且大於 0')
  else if (typeof settings.interval !== 'number' || settings.interval < 0) throw new Error('[LCL]: 設定 interval 只能為一個 <數字> 且大於 -1')
  else if (typeof settings.maxChunks !== 'number' || settings.maxChunks < 1) throw new Error('[LCL]: 設定 maxChunks 只能為一個 <數字> 且大於 0')
  else if (typeof settings.maxCallLength !== 'number' || settings.maxCallLength < 1) throw new Error('[LCL]: 設定 maxCallLength 只能為一個 <數字> 且大於 0')
  else if (typeof settings.logToConsole !== 'boolean') throw new Error('[LCL]: 設定 logToConsole 只能為一個 <布林值>')
  else if (typeof settings.saveLog !== 'boolean') throw new Error('[LCL]: 設定 saveLog 只能為一個 <布林值>')
  else if (typeof settings.actuatorLog !== 'boolean') throw new Error('[LCL]: 設定 actuatorLog 只能為一個 <布林值>')
  else if (typeof settings.detailedError !== 'boolean') throw new Error('[LCL]: 設定 detailedError 只能為一個 <布林值>')
  else if (typeof settings.vDiskPath !== 'string') throw new Error('[LCL]: 設定 vDiskPath 只能為一個 <字串>')
  return settings
}