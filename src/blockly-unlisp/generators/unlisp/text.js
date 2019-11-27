'use strict'

import * as Blockly from 'blockly/core'

Blockly.UnLisp['text'] = function (block) {
  // Text value.
  var code = Blockly.UnLisp.quote_(block.getFieldValue('TEXT'))
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['text_print'] = function (block) {
  // Print statement.
  var msg = Blockly.UnLisp.valueToCode(block, 'TEXT', Blockly.UnLisp.ORDER_NONE) || '()'
  return '(print ' + msg + ')\n'
}

Blockly.UnLisp['unlisp_text_quote'] = function (block) {
  var value = Blockly.UnLisp.valueToCode(block, 'VALUE', Blockly.UnLisp.ORDER_NONE) || '()'
  var code = Blockly.UnLisp.quote_(value)
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['unlisp_text_eval'] = function (block) {
  var quote = Blockly.UnLisp.valueToCode(block, 'QUOTE', Blockly.UnLisp.ORDER_NONE) || '()'
  return ['(eval ' + quote + ')', Blockly.UnLisp.ORDER_ATOMIC]
}
