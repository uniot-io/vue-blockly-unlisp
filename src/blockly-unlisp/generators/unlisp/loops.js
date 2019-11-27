'use strict'

import * as Blockly from 'blockly/core'

Blockly.UnLisp['unlisp_controls_repeat'] = function (block) {
  // Repeat n times.
  var repeats = 0
  if (block.getField('TIMES')) {
    // Internal number.
    repeats = String(Number(block.getFieldValue('TIMES')))
  } else {
    // External number.
    repeats = Blockly.UnLisp.valueToCode(block, 'TIMES', Blockly.UnLisp.ORDER_NONE) || '0'
  }
  var branch = Blockly.UnLisp.statementToCode(block, 'DO')
  branch = Blockly.UnLisp.addLoopTrap(branch, block)
  branch = branch || '()'
  // do not need this because #itr is an UnLisp system variable
  // var loopVar = Blockly.UnLisp.variableDB_.getDistinctName('#itr', Blockly.Variables.NAME_TYPE)
  return '(while (< #itr ' + repeats + ') ' + Blockly.UnLisp.cleanCode(branch) + ')\n'
}

Blockly.UnLisp['unlisp_controls_whileUntil'] = function (block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') === 'UNTIL'
  var argument0 = Blockly.UnLisp.valueToCode(block, 'BOOL',
    until
      ? Blockly.UnLisp.ORDER_UNARY
      : Blockly.UnLisp.ORDER_NONE) || '()'
  var branch = Blockly.UnLisp.statementToCode(block, 'DO')
  branch = Blockly.UnLisp.addLoopTrap(branch, block)
  branch = branch || '()'
  if (until) {
    argument0 = '(not ' + argument0 + ')'
  }
  return '(while ' + argument0 + ' ' + Blockly.UnLisp.cleanCode(branch) + ')\n'
}

Blockly.UnLisp['unlisp_while_itr'] = function () {
  return ['#itr', Blockly.UnLisp.ORDER_HIGH]
}

Blockly.UnLisp['controls_repeat'] = Blockly.UnLisp['unlisp_controls_repeat']
Blockly.UnLisp['controls_repeat_ext'] = Blockly.UnLisp['unlisp_controls_repeat']
Blockly.UnLisp['controls_whileUntil'] = Blockly.UnLisp['unlisp_controls_whileUntil']
