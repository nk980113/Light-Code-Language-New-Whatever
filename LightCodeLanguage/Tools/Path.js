import os from 'node:os'

export { getPath, getFileName }

//取得路徑
function getPath (basePath, move) {
  let symbol = getSymbol()
  let analysis = basePath.split(symbol)
  move.map((item) => {
    if (item === '<') analysis.splice(analysis.length-1, 1)
    else analysis.push(item)
  })
  return analysis.join(symbol)
}

//取得此系統的路徑分割符號
function getSymbol () {
  let platform = os.platform()
  if (platform === 'darwin' || platform === 'linux') return '/'
  else if (platform === 'win32') return '\\'
}

//取得檔案名
function getFileName (path) {
  let analysis = path.split(getSymbol())
  return analysis[analysis.length-1]
}