'use strict'

import * as Blockly from 'blockly/core'

Blockly.UnLisp['variables_get'] = function (block) {
  // Variable getter.
  var code = Blockly.UnLisp.variableDB_.getName(block.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE)
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['variables_set'] = function (block) {
  // Variable setter.
  var argument0 = Blockly.UnLisp.valueToCode(block, 'VALUE',
    Blockly.UnLisp.ORDER_NONE) || '0'
  var varName = Blockly.UnLisp.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE)
  return '(setq ' + varName + ' ' + argument0 + ')\n'
}
