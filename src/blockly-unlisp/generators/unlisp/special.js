'use strict'

import * as Blockly from 'blockly/core'

Blockly.UnLisp['unlisp_special_task'] = function (block) {
  // Repeat n times.
  var times = Blockly.UnLisp.valueToCode(block, 'TIMES', Blockly.UnLisp.ORDER_NONE) || '0'
  var ms = Blockly.UnLisp.valueToCode(block, 'MS', Blockly.UnLisp.ORDER_NONE) || '0'
  var branch = Blockly.UnLisp.statementToCode(block, 'OBJ')
  branch = branch || '()'
  return '(task ' + times + ' ' + ms + ' \'(list ' + Blockly.UnLisp.cleanCode(branch) + '))\n'
}

Blockly.UnLisp['unlisp_special_led'] = function (block) {
  // Repeat n times.
  var id = Blockly.UnLisp.valueToCode(block, 'ID', Blockly.UnLisp.ORDER_NONE) || '0'
  var state = Blockly.UnLisp.valueToCode(block, 'STATE', Blockly.UnLisp.ORDER_NONE) || '0'
  return '(led ' + id + ' ' + state + ')'
}

Blockly.UnLisp['unlisp_special_ldr'] = function () {
  return ['(ldr)', Blockly.UnLisp.ORDER_HIGH]
}

Blockly.UnLisp['unlisp_special_task_pass'] = function () {
  return ['#t_pass', Blockly.UnLisp.ORDER_HIGH]
}
