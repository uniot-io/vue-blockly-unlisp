'use strict'

import * as Blockly from 'blockly/core'

// UnLisp is dynamically typed.
Blockly.UnLisp['variables_get_dynamic'] = Blockly.UnLisp['variables_get']
Blockly.UnLisp['variables_set_dynamic'] = Blockly.UnLisp['variables_set']
