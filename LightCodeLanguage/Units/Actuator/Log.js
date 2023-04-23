import { parentPort } from 'node:worker_threads'

//輸出東西
export default (type, content) => {
  parentPort.postMessage({ type: 'log', data: { type, content }})
}