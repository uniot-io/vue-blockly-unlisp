'use strict'

import * as Blockly from 'blockly/core'

Blockly.UnLisp['controls_if'] = function (block) {
  // If/elseif/else condition.
  var n = 0
  var code = ''
  var branchCode
  var conditionCode
  if (Blockly.UnLisp.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.UnLisp.injectId(Blockly.UnLisp.STATEMENT_PREFIX, block)
  }
  do {
    conditionCode = Blockly.UnLisp.valueToCode(block, 'IF' + n, Blockly.UnLisp.ORDER_NONE) || '()'
    branchCode = Blockly.UnLisp.statementToCode(block, 'DO' + n) || '()'
    if (Blockly.UnLisp.STATEMENT_SUFFIX) {
      branchCode = Blockly.UnLisp.prefixLines(
        Blockly.UnLisp.injectId(Blockly.UnLisp.STATEMENT_SUFFIX, block),
        Blockly.UnLisp.INDENT) + branchCode
    }
    if (branchCode.length > 2) {
      branchCode = '(list ' + branchCode + ')'
    }
    code = code.replace('{else}', '')
    code += (n > 0 ? ' ' : '') + '(if ' + conditionCode + ' ' + Blockly.UnLisp.cleanCode(branchCode) + (n > 0 ? '{else})' : '{else}')
    ++n
  } while (block.getInput('IF' + n))

  if (block.getInput('ELSE') || Blockly.UnLisp.STATEMENT_SUFFIX) {
    branchCode = Blockly.UnLisp.statementToCode(block, 'ELSE') || '()'
    if (Blockly.UnLisp.STATEMENT_SUFFIX) {
      branchCode = Blockly.UnLisp.prefixLines(
        Blockly.UnLisp.injectId(Blockly.UnLisp.STATEMENT_SUFFIX, block),
        Blockly.UnLisp.INDENT) + branchCode
    }
    if (branchCode.length > 2) {
      branchCode = '(list ' + branchCode + ')'
    }
    code = code.replace('{else}', ' ' + Blockly.UnLisp.cleanCode(branchCode))
  } else {
    code = code.replace('{else}', '')
  }
  return code + ')\n'
}

Blockly.UnLisp['controls_ifelse'] = Blockly.UnLisp['controls_if']

Blockly.UnLisp['logic_compare'] = function (block) {
  // Comparison operator.
  // TODO: make sure that is enough... checkChildrenType returns true if stumbled upon on variable
  // TODO: return a non-binary value to make a decision here
  var OP_EQ = Blockly.UnLisp.checkChildrenType(block, ['A', 'B'], 'Number') ? '=' : 'eq'
  var OPERATORS = {
    'EQ': OP_EQ,
    'NEQ': OP_EQ,
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  }

  var op = block.getFieldValue('OP')
  var operator = OPERATORS[block.getFieldValue('OP')]
  var argument0 = Blockly.UnLisp.valueToCode(block, 'A', Blockly.UnLisp.ORDER_NONE) || '()'
  var argument1 = Blockly.UnLisp.valueToCode(block, 'B', Blockly.UnLisp.ORDER_NONE) || '()'
  var code = '(' + operator + ' ' + argument0 + ' ' + argument1 + ')'
  return [op === 'NEQ' ? '(not ' + code + ')' : code, Blockly.UnLisp.ORDER_RELATIONAL]
}

Blockly.UnLisp['logic_operation'] = function (block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') === 'AND') ? 'and' : 'or'
  var order = (operator === 'and') ? Blockly.UnLisp.ORDER_AND : Blockly.UnLisp.ORDER_OR
  var argument0 = Blockly.UnLisp.valueToCode(block, 'A', order)
  var argument1 = Blockly.UnLisp.valueToCode(block, 'B', order)
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = '()'
    argument1 = '()'
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator === 'and') ? '#t' : '()'
    if (!argument0) {
      argument0 = defaultArgument
    }
    if (!argument1) {
      argument1 = defaultArgument
    }
  }
  var code = '(' + operator + ' ' + argument0 + ' ' + argument1 + ')'
  return [code, order]
}

Blockly.UnLisp['logic_negate'] = function (block) {
  // Negation.
  var argument0 = Blockly.UnLisp.valueToCode(block, 'BOOL', Blockly.UnLisp.ORDER_NONE) || '#t'
  var code = '(not ' + argument0 + ')'
  return [code, Blockly.UnLisp.ORDER_UNARY]
}

Blockly.UnLisp['logic_boolean'] = function (block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') === 'TRUE') ? '#t' : '()'
  return [code, Blockly.UnLisp.ORDER_ATOMIC]
}

Blockly.UnLisp['logic_ternary'] = function (block) {
  // Ternary operator.
  var valueIf = Blockly.UnLisp.valueToCode(block, 'IF', Blockly.UnLisp.ORDER_AND) || '()'
  var valueThen = Blockly.UnLisp.valueToCode(block, 'THEN', Blockly.UnLisp.ORDER_AND) || '()'
  var valueElse = Blockly.UnLisp.valueToCode(block, 'ELSE', Blockly.UnLisp.ORDER_OR) || '()'
  var code = '(if ' + valueIf + ' ' + valueThen + ' ' + valueElse + ')'
  return [code, Blockly.UnLisp.ORDER_OR]
}
