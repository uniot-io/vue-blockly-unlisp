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

Blockly.UnLisp['unlisp_special_dwrite'] = function (block) {
  var id = Blockly.UnLisp.valueToCode(block, 'ID', Blockly.UnLisp.ORDER_NONE) || '0'
  var state = Blockly.UnLisp.valueToCode(block, 'STATE', Blockly.UnLisp.ORDER_NONE) || '0'
  return '(dwrite ' + id + ' ' + state + ')'
}

Blockly.UnLisp['unlisp_special_dread'] = function (block) {
  var id = Blockly.UnLisp.valueToCode(block, 'ID', Blockly.UnLisp.ORDER_NONE) || '0'
  return '(dread ' + id + ')'
}

Blockly.UnLisp['unlisp_special_awrite'] = function (block) {
  var id = Blockly.UnLisp.valueToCode(block, 'ID', Blockly.UnLisp.ORDER_NONE) || '0'
  var state = Blockly.UnLisp.valueToCode(block, 'STATE', Blockly.UnLisp.ORDER_NONE) || '0'
  return '(awrite ' + id + ' ' + state + ')'
}

Blockly.UnLisp['unlisp_special_aread'] = function (block) {
  var id = Blockly.UnLisp.valueToCode(block, 'ID', Blockly.UnLisp.ORDER_NONE) || '0'
  return '(aread ' + id + ')'
}

Blockly.UnLisp['unlisp_special_task_pass'] = function () {
  return ['#t_pass', Blockly.UnLisp.ORDER_HIGH]
}
