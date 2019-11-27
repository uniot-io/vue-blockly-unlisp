'use strict'

import * as Blockly from 'blockly/core'

Blockly.UnLisp['procedures_defreturn'] = function (block) {
  // Define a procedure with a return value.
  var funcName = Blockly.UnLisp.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE)
  var xfix1 = ''
  if (Blockly.UnLisp.STATEMENT_PREFIX) {
    xfix1 += Blockly.UnLisp.injectId(Blockly.UnLisp.STATEMENT_PREFIX, block)
  }
  if (Blockly.UnLisp.STATEMENT_SUFFIX) {
    xfix1 += Blockly.UnLisp.injectId(Blockly.UnLisp.STATEMENT_SUFFIX, block)
  }
  if (xfix1) {
    xfix1 = Blockly.UnLisp.prefixLines(xfix1, Blockly.UnLisp.INDENT)
  }
  var branch = Blockly.UnLisp.statementToCode(block, 'STACK')
  var returnValue = Blockly.UnLisp.valueToCode(block, 'RETURN', Blockly.UnLisp.ORDER_NONE) || ''
  var xfix2 = ''
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1
  }
  var args = []
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.UnLisp.variableDB_.getName(block.arguments_[i], Blockly.Variables.NAME_TYPE)
  }
  var body = (xfix1 + branch + xfix2 + returnValue) || '()'
  body = Blockly.UnLisp.cleanCode(body)
  var code = '(defun ' + funcName + ' (' + args.join(' ') + ') ' + body + ')\n'
  code = Blockly.UnLisp.scrub_(block, code)
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.UnLisp.definitions_['%' + funcName] = code
  return null
}

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.UnLisp['procedures_defnoreturn'] = Blockly.UnLisp['procedures_defreturn']

Blockly.UnLisp['procedures_callreturn'] = function (block) {
  // Call a procedure with a return value.
  var funcName = Blockly.UnLisp.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE)
  var args = []
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.UnLisp.valueToCode(block, 'ARG' + i, Blockly.UnLisp.ORDER_NONE) || '()'
  }
  var argList = args.length ? ' ' + args.join(' ') : ''
  var code = '(' + funcName + argList + ')'
  return [code, Blockly.UnLisp.ORDER_HIGH]
}

Blockly.UnLisp['procedures_callnoreturn'] = function (block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value
  var tuple = Blockly.UnLisp['procedures_callreturn'](block)
  return tuple[0]
}
