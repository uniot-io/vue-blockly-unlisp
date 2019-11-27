'use strict'

import * as Blockly from 'blockly/core'

Blockly.defineBlocksWithJsonArray([
  {
    'type': 'unlisp_math_single',
    'message0': '%1 %2',
    'args0': [{
      'type': 'field_dropdown',
      'name': 'OP',
      'options': [
        ['%{BKY_MATH_SINGLE_OP_ABSOLUTE}', 'ABS'],
        ['-', 'NEG']
      ]
    },
    {
      'type': 'input_value',
      'name': 'NUM',
      'check': 'Number'
    }
    ],
    'output': 'Number',
    'style': 'math_blocks',
    'helpUrl': '%{BKY_MATH_SINGLE_HELPURL}',
    'extensions': ['math_op_tooltip']
  },
  {
    'type': 'unlisp_math_number_property',
    'message0': '%1 %2',
    'args0': [{
      'type': 'input_value',
      'name': 'NUMBER_TO_CHECK',
      'check': 'Number'
    },
    {
      'type': 'field_dropdown',
      'name': 'PROPERTY',
      'options': [
        ['%{BKY_MATH_IS_EVEN}', 'EVEN'],
        ['%{BKY_MATH_IS_ODD}', 'ODD'],
        ['%{BKY_MATH_IS_POSITIVE}', 'POSITIVE'],
        ['%{BKY_MATH_IS_NEGATIVE}', 'NEGATIVE'],
        ['%{BKY_MATH_IS_DIVISIBLE_BY}', 'DIVISIBLE_BY']
      ]
    }
    ],
    'inputsInline': true,
    'output': 'Boolean',
    'style': 'math_blocks',
    'tooltip': '%{BKY_MATH_IS_TOOLTIP}',
    'mutator': 'math_is_divisibleby_mutator'
  }
])
