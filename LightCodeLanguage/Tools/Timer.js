export { createTimer, changeInterval, deleteTimer }

import generateID from "./GenerateID.js"

let timers = []

//使用ID取得計時器的Row
function getTimerRow (id) {
  for (let i = 0; i < timers.length; i++) {
    if (timers[i].id === id) return i
  }
}

setInterval(() => {
  let time = performance.now()
  for (let item of timers) {
    if (time-item.lastUpdateTime >= item.interval) {
      if (item.timers !== Infinity) item.count++
      if (typeof item.callback === 'function')  item.callback(item.count)
      if (item.count >= item.times) {
        timers.splice(getTimerRow(item.id), 1)
        if (typeof item.finishCallback === 'function') item.finishCallback()
      }
      item.lastUpdateTime = time
    }
  }
}, 1)

//創建計時器
function createTimer (times, interval, callback, finishCallback) {
  let keys = []
  timers.map((item) => keys.push(item.id))
  let id = generateID('5', keys)
  timers.push({
    id,
    times,
    interval,
    callback,
    finishCallback,
    lastUpdateTime: 0,
    count: 0
  })
  return id
}

//改變間隔
function changeInterval (timerId, interval) {
  timers.map((item, row) => {
    if (item.id === timerId) {
      item.interval = interval
    }
  })
}

//刪除計時器
function deleteTimer (timerId) {
  timers.map((item, row) => {
    if (item.id === timerId) timers.splice(row, 1)
  })
}