'use strict'

import * as Blockly from 'blockly/core'

var Helper = {
  REPEAT_LOOP_TYPES: [
    'controls_repeat',
    'controls_repeat_ext',
    'unlisp_controls_repeat'
  ],

  ALL_LOOP_TYPES: [
    'controls_repeat',
    'controls_repeat_ext',
    'controls_forEach',
    'controls_for',
    'controls_whileUntil',
    'unlisp_controls_repeat',
    'unlisp_controls_whileUntil'
  ],

  /**
   * Is the given block enclosed (at any level) by a loop?
   * @param {!Blockly.Block} block Current block.
   * @return {Blockly.Block} The nearest surrounding loop, or null if none.
   */
  getSurroundLoop: function (block, loops = Helper.ALL_LOOP_TYPES) {
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
      if (Helper.isChildExist(blocks[i], needle)) {
        return true
      }
    }
    return false
  }
}

Blockly.defineBlocksWithJsonArray([
  {
    'type': 'unlisp_controls_repeat',
    'message0': '%{BKY_CONTROLS_REPEAT_TITLE}',
    'args0': [{
      'type': 'input_value',
      'name': 'TIMES',
      'check': 'Number'
    }],
    'message1': '%{BKY_CONTROLS_REPEAT_INPUT_DO} %1',
    'args1': [{
      'type': 'input_statement',
      'name': 'DO'
    }],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'loop_blocks',
    'tooltip': '%{BKY_CONTROLS_REPEAT_TOOLTIP}',
    'helpUrl': '%{BKY_CONTROLS_REPEAT_HELPURL}',
    'extensions': ['controls_flow_nested_loop_check']
  },
  {
    'type': 'unlisp_controls_whileUntil',
    'message0': '%1 %2',
    'args0': [{
      'type': 'field_dropdown',
      'name': 'MODE',
      'options': [
        ['%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_WHILE}', 'WHILE'],
        ['%{BKY_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL}', 'UNTIL']
      ]
    },
    {
      'type': 'input_value',
      'name': 'BOOL',
      'check': 'Boolean'
    }],
    'message1': '%{BKY_CONTROLS_REPEAT_INPUT_DO} %1',
    'args1': [{
      'type': 'input_statement',
      'name': 'DO'
    }],
    'previousStatement': null,
    'nextStatement': null,
    'style': 'loop_blocks',
    'helpUrl': '%{BKY_CONTROLS_WHILEUNTIL_HELPURL}',
    'extensions': ['controls_whileUntil_tooltip', 'controls_flow_nested_loop_check']
  }
])

Blockly.Blocks['unlisp_while_itr'] = {
  // Value input.
  init: function () {
    this.jsonInit({
      'message0': '%1',
      'args0': [{
        'type': 'field_label_serializable',
        'name': 'ITR',
        'text': 'iterator'
      }],
      'output': 'Number',
      'style': 'loop_blocks',
      'tooltip': 'DO NOT USE WITH REPEAT CYCLE',
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
    var block = Helper.getSurroundLoop(this)
    if (block) {
      var haystack = block.inputList[0].connection.targetConnection.sourceBlock_
      if ((Helper.REPEAT_LOOP_TYPES.indexOf(block.type) !== -1) && Helper.isChildExist(haystack, this)) {
        whyMsg = 'This constant returns a value. Do not use it to set up a loop.'
      } else {
        this.setWarningText(null)
        if (!this.isInFlyout) {
          this.setEnabled(true)
        }
        return
      }
    } else {
      whyMsg = Blockly.Msg['CONTROLS_FLOW_STATEMENTS_WARNING']
    }
    this.setWarningText(whyMsg)
    if (!this.isInFlyout && !this.getInheritedDisabled()) {
      this.setEnabled(false)
    }
  }
}

Blockly.Constants.Loops.CONTROL_FLOW_NESTED_LOOP_CHECK_MIXIN = {
  onchange: function () {
    if (!this.workspace.isDragging || this.workspace.isDragging()) {
      return // Don't change state at the start of a drag.
    }
    var block = this.getSurroundParent()
    if (block && Helper.getSurroundLoop(block)) {
      this.setWarningText('Nested loops are prohibited!') // TODO: move msg to dictionary
      if (!this.isInFlyout && !this.getInheritedDisabled()) {
        this.setEnabled(false)
      }
    } else {
      this.setWarningText(null)
      if (!this.isInFlyout) {
        this.setEnabled(true)
      }
    }
  }
}

Blockly.Extensions.registerMixin('controls_flow_nested_loop_check', Blockly.Constants.Loops.CONTROL_FLOW_NESTED_LOOP_CHECK_MIXIN)
