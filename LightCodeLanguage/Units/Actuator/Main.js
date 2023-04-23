import { parentPort, workerData } from 'node:worker_threads'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

import getVariableSize from '../../Tools/GetVariableSize.js'

import analysis from '../Analyzer/Analyzer.js'
import { executeLoop } from './ExecuteLoop.js'
import log from './Log.js'

let actuator = {
  id: workerData.id,
  state: {
    cpe: 0,
    memory: 0
  },

  settings: workerData.settings,
  code: workerData.code,
  mainFilePath: workerData.mainFilePath,

  chunks: {},
  executiveData: {
    tasks: [],
    nowTask: 0
  },
  caches: {},

  returnData: undefined
}

export { actuator, stopActuator }

const __dirname = dirname(fileURLToPath(import.meta.url))

//啟動執行器
async function boot () {
  log('actuatorLog', '正在啟動執行器')

  //分析程式碼
  log('actuatorLog', `開始分析 (長度 :${actuator.code.length})`)
  const time = performance.now()
  let complexTypes = analysis(actuator.code, actuator.mainFilePath)
  if (!Array.isArray(complexTypes)) {
    log('actuatorLog', `分析時發生錯誤`)
    stopActuator(complexTypes)
  }
  log('actuatorLog', `分析完成 (花費 ${Math.round((performance.now()-time)*1000)/1000} ms)`)

  //添加主Chunk
  actuator.chunks.main = {
    id: 'main',
    name: '全局',
    type: 'chunk', //chunk, childChunk
    path: actuator.mainFilePath,
    layer: '0,0', //層, 編號
    state: 'running', //wait, waitAsync
    executiveData: {
      row: 0,
      skip: undefined,
      mode: undefined,
      data: {}
    },
    containers: {
      輸出: { type: 'externalFunction', value: '[外部函數: 輸出]', async: false }
    },
    complexTypes,
    callPath: undefined,
    returnedData: undefined,
    returnData: { type: 'none', value: '無' },
  }

  //檢查記憶體
  actuator.state.memory = getVariableSize(actuator)
  console.log(actuator.state.memory, actuator.settings.vMemCanUse)
  if (actuator.state.memory > actuator.settings.vMemCanUse) stopActuator({ error: true, content: 'vMemOverLimit', vMemoryUsed: actuator.state.memory })

  log('actuatorLog', '啟動完成')

  //開始執行
  //executeLoop()
}

boot()

function addChunk () {

}

//停止執行器
function stopActuator (data) {
  parentPort.postMessage({ type: 'stop', data })
}