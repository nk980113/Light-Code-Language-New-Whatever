import { actuators } from './ActuatorManager.js'

//輸出東西
export default (id, data) => {
  if (actuators[id].settings.logToConsole) {
    if (data.type === 'actuatorLog') console.log(`[執行器]: ${data.content}`)
    else if (data.type === 'normal') console.log(data.content)
  }
  if (actuators[id].settings.saveLog) actuators[id].log.splice(0, 0, data)
}