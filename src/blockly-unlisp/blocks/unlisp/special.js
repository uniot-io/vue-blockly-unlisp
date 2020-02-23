'use strict'

import * as Blockly from 'blockly/core'

var TaskHelper = {
  TASK_TYPES: [
    'unlisp_special_task'
  ],

  /**
   * Is the given block enclosed (at any level) by a loop?
   * @param {!Blockly.Block} block Current block.
   * @return {Blockly.Block} The nearest surrounding loop, or null if none.
   */
  getSurroundLoop: function (block, loops = TaskHelper.TASK_TYPES) {
    // Is the block nested in a loop?
    do {
      if (loops.indexOf(block.type) !== -1) {
        return block
      }
      block = block.getSurroundParent()
    } while (block)
    return null
  },

  isChildExist: function (block, needle) {
    // TODO: refactoring
    if (block && block === needle) {
      return true
    }
    var blocks = block.getChildren()
    for (var i = 0; i < blocks.length; i++) {
      if (TaskHelper.isChildExist(blocks[i], needle)) {
        return true
      }
    }
    return false
  }
}

Blockly.defineBlocksWithJsonArray([
  {
    'type': 'unlisp_special_task',
    'message0': 'run task times %1 ms %2 do %3',
    'args0': [
      {
        'type': 'input_value',
        'name': 'TIMES',
        'check': 'Number'
      },
      {
        'type': 'input_value',
        'name': 'MS',
        'check': 'Number'
      },
      {
        'type': 'input_statement',
        'name': 'OBJ'
      }
    ],
    'inputsInline': true,
    'style': 'special_blocks',
    'tooltip': '',
    'helpUrl': '',
    'extensions': ['controls_flow_task_count_check']
  },
  {
    'type': 'unlisp_special_dwrite',
    'message0': 'digital write %2 to pin %1',
    'args0': [
      {
        'type': 'input_value',
        'name': 'ID',
        'check': 'Number'
      },
      {
        'type': 'input_value',
        'name': 'STATE',
        'check': [
          'Number',
          'Boolean'
        ]
      }
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'special_blocks',
    'tooltip': '',
    'helpUrl': ''
  },
  {
    'type': 'unlisp_special_dread',
    'message0': 'digital read %1 pin',
    'args0': [
      {
        'type': 'input_value',
        'name': 'ID',
        'check': 'Number'
      }
    ],
    'inputsInline': true,
    'output': 'Number',
    'style': 'special_blocks',
    'tooltip': '',
    'helpUrl': ''
  },
  {
    'type': 'unlisp_special_awrite',
    'message0': 'analog write %2 to pin %1',
    'args0': [
      {
        'type': 'input_value',
        'name': 'ID',
        'check': 'Number'
      },
      {
        'type': 'input_value',
        'name': 'STATE',
        'check': 'Number'
      }
    ],
    'inputsInline': true,
    'previousStatement': null,
    'nextStatement': null,
    'style': 'special_blocks',
    'tooltip': '',
    'helpUrl': ''
  },
  {
    'type': 'unlisp_special_aread',
    'message0': 'analog read %1 pin',
    'args0': [
      {
        'type': 'input_value',
        'name': 'ID',
        'check': 'Number'
      }
    ],
    'inputsInline': true,
    'output': 'Number',
    'style': 'special_blocks',
    'tooltip': '',
    'helpUrl': ''
  }
])

Blockly.Blocks['unlisp_special_task_pass'] = {
  guilty: false,

  init: function () {
    this.jsonInit({
      'message0': '%1',
      'args0': [{
        'type': 'field_label_serializable',
        'name': 'PASS',
        'text': 'task pass'
      }],
      'inputsInline': true,
      'output': 'Number',
      'style': 'special_blocks',
      'tooltip': '',
      'helpUrl': ''
    })
  },

  /**
   * Called whenever anything on the workspace changes.
   * Add warning if this flow block is not nested inside a loop.
   * @param {!Blockly.Events.Abstract} _e Change event.
   * @this {Blockly.Block}
   */
  onchange: function () {
    // TODO: check if ITR in REPEAT LOOP and disallow it
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return // Don't change state at the start of a drag.
    }
    var whyMsg = null
    var block = TaskHelper.getSurroundLoop(this)
    if (block) {
      for (let i = 0; i < 2; i++) {
        var haystack = block.inputList[i].connection.targetConnection.sourceBlock_
        if ((TaskHelper.TASK_TYPES.indexOf(block.type) !== -1) && TaskHelper.isChildExist(haystack, this)) {
          whyMsg = 'This constant returns a value. Do not use it to set up a task.'
          break
        }
      }
      if (!whyMsg) {
        this.setWarningText(null)
        if (!this.isInFlyout) {
          const enabled = !this.disabled
          this.setEnabled(this.guilty || enabled)
          this.guilty = false
        }
        return
      }
    } else {
      whyMsg = 'This block may only be used within a task'
    }
    this.setWarningText(whyMsg)
    if (!this.isInFlyout && !this.getInheritedDisabled()) {
      this.setEnabled(false)
      this.guilty = true
    }
  }
}

Blockly.Constants.Loops.CONTROL_FLOW_TASK_COUNT_CHECK_MIXIN = {
  guilty: false,

  onchange: function () {
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return // Don't change state at the start of a drag.
    }
    var taskCount = this.workspace.getTopBlocks(false)
      .reduce(function (count, block) {
        var blacklisted = TaskHelper.TASK_TYPES.indexOf(block.type) !== -1
        return count + (blacklisted ? 1 : 0)
      }, 0)
    if (taskCount > 1) {
      this.setWarningText('Only one task allowed')
      if (!this.isInFlyout && !this.getInheritedDisabled()) {
        this.setEnabled(false)
        this.guilty = true
      }
    } else {
      this.setWarningText(null)
      if (!this.isInFlyout) {
        const enabled = !this.disabled
        this.setEnabled(this.guilty || enabled)
        this.guilty = false
      }
    }
  }
}

Blockly.Extensions.registerMixin('controls_flow_task_count_check', Blockly.Constants.Loops.CONTROL_FLOW_TASK_COUNT_CHECK_MIXIN)
