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
  var code = '(dread ' + id + ')'
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['unlisp_special_awrite'] = function (block) {
  var id = Blockly.UnLisp.valueToCode(block, 'ID', Blockly.UnLisp.ORDER_NONE) || '0'
  var state = Blockly.UnLisp.valueToCode(block, 'STATE', Blockly.UnLisp.ORDER_NONE) || '0'
  return '(awrite ' + id + ' ' + state + ')'
}

Blockly.UnLisp['unlisp_special_aread'] = function (block) {
  var id = Blockly.UnLisp.valueToCode(block, 'ID', Blockly.UnLisp.ORDER_NONE) || '0'
  var code = '(aread ' + id + ')'
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['unlisp_special_task_pass'] = function () {
  return ['#t_pass', Blockly.UnLisp.ORDER_HIGH]
}

Blockly.UnLisp['unlisp_special_bclicked'] = function (block) {
  var id = Blockly.UnLisp.valueToCode(block, 'ID', Blockly.UnLisp.ORDER_NONE) || '0'
  var code = '(bclicked ' + id + ')'
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['unlisp_special_primitive'] = function (block) {
  var isStatement = !block.outputConnection

  var primitive = block.getFieldValue('PRIMITIVE')

  var elements = new Array(block.itemCount_)
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.UnLisp.valueToCode(block, 'ADD' + i, Blockly.UnLisp.ORDER_NONE) || '()'
  }
  var code = '(' + primitive + ' ' + (elements.length ? elements.join(' ') : '()') + ')'

  Blockly.UnLisp.pushPrimitive(primitive, elements.length)

  return isStatement ? code : [code, Blockly.UnLisp.ORDER_ATOMIC]
}
