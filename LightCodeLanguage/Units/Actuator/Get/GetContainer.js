import { actuator } from '../Main.js'

//取得容器
function getContainer (name, layer) {
  let keys = Object.keys(actuator.chunks)
  for (let item of keys) {
    if (layer.substring(0, actuator.chunks[item].layer.length) = actuator.chunks[item].layer) {
      console.log(true)
    }
  }
}