'use strict'

import * as Blockly from 'blockly/core'

Blockly.defineBlocksWithJsonArray([
  {
    'type': 'unlisp_text_quote',
    'message0': 'quote %1',
    'args0': [{
      'type': 'input_value',
      'name': 'VALUE'
    }],
    'output': 'String',
    'style': 'text_blocks',
    'tooltip': '',
    'helpUrl': ''
  },
  {
    'type': 'unlisp_text_eval',
    'message0': 'eval %1',
    'args0': [{
      'type': 'input_value',
      'name': 'QUOTE',
      'check': 'String'
    }],
    'output': null,
    'style': 'text_blocks',
    'tooltip': '',
    'helpUrl': ''
  }
])
