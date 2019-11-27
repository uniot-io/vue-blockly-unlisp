'use strict'

import * as Blockly from 'blockly/core'

Blockly.UnLisp['math_number'] = function (block) {
  // Numeric value.
  var code = Number(block.getFieldValue('NUM'))
  var order = code < 0 ? Blockly.UnLisp.ORDER_UNARY : Blockly.UnLisp.ORDER_ATOMIC
  return [code, order]
}

Blockly.UnLisp['math_arithmetic'] = function (block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    ADD: ['+', Blockly.UnLisp.ORDER_ADDITIVE],
    MINUS: ['-', Blockly.UnLisp.ORDER_ADDITIVE],
    MULTIPLY: ['*', Blockly.UnLisp.ORDER_MULTIPLICATIVE],
    DIVIDE: ['/', Blockly.UnLisp.ORDER_MULTIPLICATIVE],
    POWER: ['^', Blockly.UnLisp.ORDER_EXPONENTIATION]
  }
  var tuple = OPERATORS[block.getFieldValue('OP')]
  var operator = tuple[0]
  var order = tuple[1]
  var argument0 = Blockly.UnLisp.valueToCode(block, 'A', order) || '0'
  var argument1 = Blockly.UnLisp.valueToCode(block, 'B', order) || '0'
  var code = '(' + operator + ' ' + argument0 + ' ' + argument1 + ')'
  return [code, order]
}

Blockly.UnLisp['unlisp_math_single'] = function (block) {
  // Math operators with single operand.
  var code = '()'
  var arg = Blockly.UnLisp.valueToCode(block, 'NUM', Blockly.UnLisp.ORDER_UNARY) || '0'
  var operator = block.getFieldValue('OP')
  switch (operator) {
    case 'ABS':
      code = '(abs ' + arg + ')'
      break
    case 'NEG':
      code = '(- ' + arg + ')'
      break
    default:
      throw Error('Unknown math operator: ' + operator)
  }
  return [code, Blockly.UnLisp.ORDER_HIGH]
}

Blockly.UnLisp['unlisp_math_number_property'] = function (block) {
  // Check if a number is even, odd, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var numberToCheck = Blockly.UnLisp.valueToCode(block, 'NUMBER_TO_CHECK', Blockly.UnLisp.ORDER_MULTIPLICATIVE) || '0'
  var dropdownProperty = block.getFieldValue('PROPERTY')
  var code
  switch (dropdownProperty) {
    case 'EVEN':
      code = '(= (% ' + numberToCheck + ' 2) 0)'
      break
    case 'ODD':
      code = '(= (% ' + numberToCheck + ' 2) 1)'
      break
    case 'POSITIVE':
      code = '(> ' + numberToCheck + ' 0)'
      break
    case 'NEGATIVE':
      code = '(< ' + numberToCheck + ' 0)'
      break
    case 'DIVISIBLE_BY':
      var divisor = Blockly.UnLisp.valueToCode(block, 'DIVISOR', Blockly.UnLisp.ORDER_MULTIPLICATIVE)
      if (!divisor || divisor === '0') {
        return ['()', Blockly.UnLisp.ORDER_ATOMIC]
      }
      code = '(= (% ' + numberToCheck + ' ' + divisor + ') 0)'
      break
  }
  return [code, Blockly.UnLisp.ORDER_RELATIONAL]
}

Blockly.UnLisp['math_modulo'] = function (block) {
  // Remainder computation.
  var argument0 = Blockly.UnLisp.valueToCode(block, 'DIVIDEND', Blockly.UnLisp.ORDER_MULTIPLICATIVE) || '0'
  var argument1 = Blockly.UnLisp.valueToCode(block, 'DIVISOR', Blockly.UnLisp.ORDER_MULTIPLICATIVE) || '0'
  var code = '(% ' + argument0 + ' ' + argument1 + ')'
  return [code, Blockly.UnLisp.ORDER_MULTIPLICATIVE]
}

Blockly.UnLisp['math_change'] = function (block) {
  // Add to a variable in place.
  var argument0 = Blockly.UnLisp.valueToCode(block, 'DELTA', Blockly.UnLisp.ORDER_ADDITIVE) || '0'
  var varName = Blockly.UnLisp.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE)
  return '(setq ' + varName + ' (+ ' + varName + ' ' + argument0 + '))\n'
}
