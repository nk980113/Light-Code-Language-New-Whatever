import { fileURLToPath } from 'url'
import { dirname } from 'path'

import complexTypesAnalyzer from "./ComplexTypesAnalyzer.js"
import simpleTypesAnalyzer from "./SimpleTypesAnalyzer.js"
import expressionAnalyzer from './ExpressionAnalyzer.js'
import checkSyntax from './SyntaxChecker.js'

const __dirname = `${dirname(fileURLToPath(import.meta.url))}.js`

//分析
export default (code, filePath) => {
  let simpleTypes = simpleTypesAnalyzer(code)
  if (Array.isArray(simpleTypes)) {
    let complexTypes = complexTypesAnalyzer(simpleTypes)
    if (Array.isArray(complexTypes)) {
      let complexTypes2 = expressionAnalyzer(complexTypes)
      if (Array.isArray(complexTypes)) {
        return complexTypes2 
      } else {
        complexTypes2.path.push({ filePath: __dirname, function: '{分析器}' })
        return Object.assign(complexTypes2, { filePath })
      }
    } else {
      complexTypes.path.push({ filePath: __dirname, function: '{分析器}' })
      return Object.assign(complexTypes, { filePath })
    }
  } else {
    complexTypes.path.push({ filePath: __dirname, function: '{分析器}' })
    return Object.assign(simpleTypes, { filePath })
  }
}