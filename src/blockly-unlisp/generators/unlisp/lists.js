'use strict'

import * as Blockly from 'blockly/core'

Blockly.UnLisp['lists_create_with'] = function (block) {
  // Create a list with any number of elements of any type.
  var elements = new Array(block.itemCount_)
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.UnLisp.valueToCode(block, 'ADD' + i, Blockly.UnLisp.ORDER_NONE) || '()'
  }
  var code = '(list ' + (elements.length ? elements.join(' ') : '()') + ')'
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['unlisp_statement_list'] = function (block) {
  // Create a list with any number of elements of any type.
  var branch = Blockly.UnLisp.statementToCode(block, 'LIST') || ''
  branch = branch ? ' ' + Blockly.UnLisp.cleanCode(branch) : ''
  var code = '(list' + branch + ')'
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['unlisp_list_car'] = function (block) {
  var branch = Blockly.UnLisp.valueToCode(block, 'LIST', Blockly.UnLisp.ORDER_NONE) || ''
  var code = branch ? '(car ' + branch + ')' : '()'
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['unlisp_list_cdr'] = function (block) {
  var branch = Blockly.UnLisp.valueToCode(block, 'LIST', Blockly.UnLisp.ORDER_NONE) || ''
  var code = branch ? '(cdr ' + branch + ')' : '()'
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}
