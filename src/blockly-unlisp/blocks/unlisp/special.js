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
    'output': 'Boolean',
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
  },
  {
    'type': 'unlisp_special_bclicked',
    'message0': 'is button %1 clicked',
    'args0': [{
      'type': 'input_value',
      'name': 'ID',
      'check': 'Number'
    }],
    'inputsInline': true,
    'output': 'Boolean',
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

Blockly.Blocks['unlisp_special_primitive'] = {

  init: function () {
    this.setHelpUrl('')
    this.setStyle('special_blocks')
    this.itemCount_ = 2
    this.setReturn_(true)
    this.updateShape_()
    this.setMutator(new Blockly.Mutator(['unlisp_special_primitive_item']))
    this.setTooltip('')
  },

  setReturn_: function (value) {
    if (this.isReturn_ !== value) {
      this.unplug(true)
    }
    this.isReturn_ = value
  },

  /**
   * Create XML to represent inputs.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement('mutation')
    container.setAttribute('items', this.itemCount_)
    container.setAttribute('is_return', this.isReturn_ ? 'true' : 'false')
    return container
  },
  /**
   * Parse XML to restore the inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10)
    this.setReturn_(xmlElement.getAttribute('is_return') === 'true')
    this.updateShape_()
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this {Blockly.Block}
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock('unlisp_special_primitive_container')
    containerBlock.initSvg()
    var connection = containerBlock.getInput('STACK').connection
    for (let i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('unlisp_special_primitive_item')
      itemBlock.initSvg()
      connection.connect(itemBlock.previousConnection)
      connection = itemBlock.nextConnection
    }

    containerBlock.setReturn(this.isReturn_)
    return containerBlock
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  compose: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK')
    // Count number of inputs.
    var connections = []
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_)
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock()
    }
    // Disconnect any children that don't belong.
    for (let i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput('ADD' + i).connection.targetConnection
      if (connection && connections.indexOf(connection) === -1) {
        connection.disconnect()
      }
    }
    this.itemCount_ = connections.length
    this.setReturn_(containerBlock.isReturn())
    this.updateShape_()
    // Reconnect any child blocks.
    for (let i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i)
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  saveConnections: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK')
    var i = 0
    while (itemBlock) {
      var input = this.getInput('ADD' + i)
      itemBlock.valueConnection_ = input && input.connection.targetConnection
      i++
      itemBlock = itemBlock.nextConnection &&
        itemBlock.nextConnection.targetBlock()
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this {Blockly.Block}
   */
  updateShape_: function () {
    const fieldPrimitiveName = new Blockly.FieldTextInput('user_primitive', function (name) {
      return name.replace(/\s+/g, '_')
    })

    this.updateStatement_()

    if (this.itemCount_ && this.getInput('EMPTY')) {
      this.removeInput('EMPTY')
    } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
      this.appendDummyInput('EMPTY')
        .appendField(fieldPrimitiveName, 'PRIMITIVE')
    }
    // Add new inputs.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput('ADD' + i)) {
        var input = this.appendValueInput('ADD' + i)
        if (i === 0) {
          input.appendField(fieldPrimitiveName, 'PRIMITIVE')
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ADD' + i)) {
      this.removeInput('ADD' + i)
      i++
    }
  },

  updateStatement_: function () {
    if (this.isReturn_) {
      this.setPreviousStatement(false)
      this.setNextStatement(false)
      this.setOutput(true)
    } else {
      this.setOutput(false)
      this.setPreviousStatement(true)
      this.setNextStatement(true)
    }
  }
}

Blockly.Blocks['unlisp_special_primitive_container'] = {
  /**
   * Mutator block for list container.
   * @this {Blockly.Block}
   */
  init: function () {
    this.isReturn_ = true
    this.isReturnField_ = new Blockly.FieldCheckbox('TRUE', value => {
      this.isReturn_ = value === 'TRUE'
      return value
    })
    this.appendDummyInput()
      .appendField('primitive returns value  ')
      .appendField(this.isReturnField_, 'IS_RETURN')

    this.setStyle('special_blocks')
    this.appendStatementInput('STACK')
    this.setTooltip('')
    this.contextMenu = false
  },

  isReturn: function () {
    return this.isReturn_
  },

  setReturn: function (returns) {
    this.isReturn_ = returns
    this.isReturnField_.doValueUpdate_(returns ? 'TRUE' : 'FALSE')
  }
}

Blockly.Blocks['unlisp_special_primitive_item'] = {
  /**
   * Mutator block for adding items.
   * @this {Blockly.Block}
   */
  init: function () {
    this.setStyle('special_blocks')
    this.appendDummyInput()
      .appendField('param')
    this.setPreviousStatement(true)
    this.setNextStatement(true)
    this.setTooltip('')
    this.contextMenu = false
  }
}
