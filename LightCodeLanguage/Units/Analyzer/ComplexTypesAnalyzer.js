import { fileURLToPath } from 'url'
import { dirname } from 'path'

import typesName from '../TypesName.json' assert { type: 'json' }
import checkSyntax from './SyntaxChecker.js'

const __dirname = `${dirname(fileURLToPath(import.meta.url))}.js`

//複雜類型分析器
export default function complexTypesAnalyzer (simpleTypes) {
  let complexTypes = []
  let state = {}
  for (let i = 0; i < simpleTypes.length; i++) {
    if (state.nowType === undefined) {
      if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === '[') state = { nowType: 'array', value: [[]], start: simpleTypes[i].start, startLine: simpleTypes[i].line, layer: simpleTypes[i].layer }
      else if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === '(') state = { nowType: 'parameters', value: [[]], start: simpleTypes[i].start, startLine: simpleTypes[i].line, layer: simpleTypes[i].layer }
      else if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === '{') {
        if (complexTypes[complexTypes.length-1] !== undefined && (complexTypes[complexTypes.length-1].type === 'parameters')) state = { nowType: 'chunk', value: [], start: simpleTypes[i].start, startLine: simpleTypes[i].line, layer: simpleTypes[i].layer }
        else state = { nowType: 'object', value: [[]], start: simpleTypes[i].start, startLine: simpleTypes[i].line, layer: simpleTypes[i].layer }
      } else complexTypes.push(simpleTypes[i])
    } else {
      if (state.nowType === 'array') {
        if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === ']' && state.layer === simpleTypes[i].layer) {
          let items = []
          for (let i2 = 0; i2 < state.value.length; i2++) {
            let data = complexTypesAnalyzer(state.value[i2])
            if (!Array.isArray(data)) return data
            let data2 = checkSyntax(data, ` (<陣列> 的第 ${i2} 項)`)
            if (data2 !== undefined) {
              data2.path.push({ filePath: __dirname, function: '{複雜類型分析器}' })
              return data2
            }
            items.push(data)
          }
          complexTypes.push({ type: 'array', value: items, start: state.start, end: i, line: state.startLine, layer: state.layer })
          state = {}
        } else {
          if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === ',' && state.layer+1 === simpleTypes[i].layer) state.value.push([])
          else state.value[state.value.length-1].push(simpleTypes[i])
        }
      } else if (state.nowType === 'parameters') {
        if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === ')' && state.layer === simpleTypes[i].layer) {
          let items = []
          for (let i2 = 0; i2 < state.value.length; i2++) {
            let data = complexTypesAnalyzer(state.value[i2])
            if (!Array.isArray(data)) return data
            let data2 = checkSyntax(data, ` (<參數列> 的第 ${i2} 項)`)
            if (data2 !== undefined) {
              data2.path.push({ filePath: __dirname, function: '{複雜類型分析器}' })
              return data2
            }
            items.push(data)
          }
          complexTypes.push({ type: 'parameters', value: items, start: state.start, end: i, line: state.startLine, layer: state.layer })
          state = {}
        } else {
          if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === ',' && state.layer+1 === simpleTypes[i].layer) state.value.push([])
          else state.value[state.value.length-1].push(simpleTypes[i])
        }
      } else if (state.nowType === 'object') {
        if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === '}' && state.layer === simpleTypes[i].layer) {
          let object = {}
          for (let item of state.value) {
            let mode = 'normal'
            let skip = 0
            if (item[0].type === 'keyword' && item[0].value === '唯讀') {
              mode = 'readOnly'
              skip = 1
            }
            if (item[skip].type === 'container') {
              if (item[skip+1] !== undefined && item[skip+1].type === 'symbol' && item[skip+1].value === ':') {
                let value = []
                for (let i = skip+2; i < item.length; i++) value.push(item[i])
                value = complexTypesAnalyzer(value)
                if (!Array.isArray(value)) return value
                let data = checkSyntax(value, ` (<物件> 的 ${item[skip].value})`)
                if (data !== undefined) {
                  data.path.push({ filePath: __dirname, function: '{複雜類型分析器}' })
                  return data
                }
                object[item[skip].value] = { value, mode }
              } else {
                if (item.length-skip > 1) return { error: true, type: 'analysis', content: `多出了一個 <${typesName[item[skip+1].type]}>`, start: item[skip+1].start, end: item[skip+1].end, path: [{ filePath: __dirname, function: '{複雜類型分析器}', line: item[skip+1].line }] }
                object[item[skip].value] = { value: [{ type: 'none', value: '無', mode }], mode }
              }
            } else {
              return { error: true, type: 'analysis', content: '<物件> 的 <鑰> 必須為一個 <容器>', start: item[skip].start, end: item[skip].end, path: [{ filePath: __dirname, function: '{複雜類型分析器}', line: item[skip].line }] }
            }
          }
          complexTypes.push({ type: 'object', value: object, start: state.start, end: i, line: state.startLine, layer: state.layer })
          state = {}
        } else {
          if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === ',' && state.layer+1 === simpleTypes[i].layer) state.value.push([])
          else state.value[state.value.length-1].push(simpleTypes[i])
        }
      } else if (state.nowType === 'chunk') {
        if (simpleTypes[i].type === 'symbol' && simpleTypes[i].value === '}' && state.layer === simpleTypes[i].layer) {
          let data = complexTypesAnalyzer(state.value)
          if (!Array.isArray(data)) return data
          complexTypes.push({ type: 'chunk', value: state.value, start: state.start, end: simpleTypes[i].end, line: state.startLine, layer: state.layer })
          state = {}
        } else state.value.push(simpleTypes[i])
      }
    }
  }
  if (state.nowType === 'array') return { error: true, type: 'analysis', content: '<陣列> 的尾端缺少 "]"', start: state.start, end: simpleTypes[simpleTypes.length-1].end, path: [{ filePath: __dirname, function: '{複雜類型分析器}', line: state.startLine }] }
  else if (state.nowType === 'parameters') return { error: true, type: 'analysis', content: '<參數列> 的尾端缺少 ")"', start: state.start, end: simpleTypes[simpleTypes.length-1].end, path: [{ filePath: __dirname, function: '{複雜類型分析器}', line: state.startLine }] }
  else if (state.nowType === 'object') return { error: true, type: 'analysis', content: '<物件> 的尾端缺少 "}"', start: state.start, end: simpleTypes[simpleTypes.length-1].end, path: [{ filePath: __dirname, function: '{複雜類型分析器}', line: state.startLine }] }
  else if (state.nowType === 'chunk') return { error: true, type: 'analysis', content: '<區塊> 的尾端缺少 "}"', start: state.start, end: simpleTypes[simpleTypes.length-1].end, path: [{ filePath: __dirname, function: '{複雜類型分析器}', line: state.startLine }] }
  return complexTypes
}