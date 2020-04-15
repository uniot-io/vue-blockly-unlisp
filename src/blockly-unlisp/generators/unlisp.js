'use strict'

import * as Blockly from 'blockly/core'

/**
 * UnLisp code generator.
 * @type {!Blockly.Generator}
 */
Blockly.UnLisp = new Blockly.Generator('UnLisp')

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.UnLisp.addReservedWords(
  '#t, #itr,' +
  'quote, cons, car, cdr, setq, setcar, while, gensym,' +
  'define, defun, defmacro, macroexpand, lambda, if, eq, print, eval, list,' +
  // user functions
  'task, led, ldr, rgb'
)

// TODO: check all types!!!
Blockly.UnLisp.ORDER_ATOMIC = 0
Blockly.UnLisp.ORDER_HIGH = 1
Blockly.UnLisp.ORDER_EXPONENTIATION = 99
Blockly.UnLisp.ORDER_UNARY = 99
Blockly.UnLisp.ORDER_MULTIPLICATIVE = 99
Blockly.UnLisp.ORDER_ADDITIVE = 99
Blockly.UnLisp.ORDER_CONCATENATION = 99
Blockly.UnLisp.ORDER_RELATIONAL = 99
Blockly.UnLisp.ORDER_AND = 99
Blockly.UnLisp.ORDER_OR = 99
Blockly.UnLisp.ORDER_NONE = 99

// Blockly.UnLisp.ORDER_OVERRIDES = [
//   [Blockly.UnLisp.ORDER_ADDITIVE, Blockly.UnLisp.ORDER_ADDITIVE],
//   [Blockly.UnLisp.ORDER_MULTIPLICATIVE, Blockly.UnLisp.ORDER_MULTIPLICATIVE],
//   [Blockly.UnLisp.ORDER_MULTIPLICATIVE, Blockly.UnLisp.ORDER_ADDITIVE]
// ]

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.UnLisp.init = function (workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.UnLisp.definitions_ = Object.create(null)
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.UnLisp.functionNames_ = Object.create(null)

  Blockly.UnLisp.primitivesNames_ = {}

  if (!Blockly.UnLisp.variableDB_) {
    Blockly.UnLisp.variableDB_ = new Blockly.Names(Blockly.UnLisp.RESERVED_WORDS_)
  } else {
    Blockly.UnLisp.variableDB_.reset()
  }
  Blockly.UnLisp.variableDB_.setVariableMap(workspace.getVariableMap())

  var defvars = []
  // Add developer variables (not created or named by the user).
  var devVarList = Blockly.Variables.allDeveloperVariables(workspace)
  for (let i = 0; i < devVarList.length; i++) {
    defvars.push(Blockly.UnLisp.variableDB_.getName(devVarList[i], Blockly.Names.DEVELOPER_VARIABLE_TYPE))
  }

  // Add user variables, but only ones that are being used.
  var excludedBlocks = ['procedures_defreturn', 'procedures_defnoreturn', 'procedures_callreturn', 'procedures_callnoreturn']
  var variables = Blockly.UnLisp.allUsedVarModelsExcept(workspace, excludedBlocks)
  for (let i = 0; i < variables.length; i++) {
    defvars.push(Blockly.UnLisp.variableDB_.getName(variables[i].getId(), Blockly.Variables.NAME_TYPE))
  }

  // Declare all of the variables.
  Blockly.UnLisp.definitions_['variables'] = ''
  for (let i = 0; i < defvars.length; i++) {
    Blockly.UnLisp.definitions_['variables'] +=
      '(define ' + defvars[i] + ' ())\n'
  }
}

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.UnLisp.finish = function (code) {
  // Convert the definitions dictionary into a list.
  var definitions = []
  for (var name in Blockly.UnLisp.definitions_) {
    definitions.push(Blockly.UnLisp.definitions_[name])
  }
  // Clean up temporary data.
  delete Blockly.UnLisp.definitions_
  delete Blockly.UnLisp.functionNames_
  Blockly.UnLisp.variableDB_.reset()
  var defCode = definitions.join('')
  return defCode + (defCode.length ? '\n' : '') + code
}

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.UnLisp.scrubNakedValue = function (line) {
  return line + '\n'
}

/**
 * Encode a string as a properly escaped UnLisp quote
 * @param {string} string Text to encode.
 * @return {string} UnLisp quote.
 * @private
 */
Blockly.UnLisp.quote_ = function (string) {
  // string = string.replace(/\\/g, '\\\\')
  //   .replace(/\n/g, '\\\n')
  //   .replace(/'/g, '\\\'')
  string = string
    .replace(/'/g, '?')
    .replace(/\[/g, '?')
    .replace(/\]/g, '?')
    .replace(/\{/g, '?')
    .replace(/\}/g, '?')
    .replace(/\\/g, '?')
    .trim()

  const spaceCount = string.split(' ').length - 1

  let complete = 0
  let splited = false
  let error = false
  let wasOpen = false
  for (let i = 0; i < string.length; i++) {
    const char = string[i]
    complete += char === '(' ? 1 : 0
    complete -= char === ')' ? 1 : 0

    if (!splited && i > 0 && i < (string.length - 1)) {
      splited = complete === 0
    }

    if (!wasOpen && complete > 0) {
      wasOpen = true
    }

    if (complete < 0) {
      error = true
      break
    }
  }

  if (complete > 0) {
    error = true
  }

  if (!wasOpen && spaceCount > 0) {
    error = true
  }

  if (error) {
    string = string
      .replace(/\s+/g, '_')
      .replace(/\(/g, '?')
      .replace(/\)/g, '?')
  } else if (splited && spaceCount > 0) {
    string = '(list ' + string + ')'
  }

  return '\'' + string
}

/**
 * Common tasks for generating UnLisp from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The UnLisp code created for this block.
 * @param {boolean=} optThisOnly True to generate code for only this statement.
 * @return {string} UnLisp code with comments and subsequent blocks added.
 * @private
 */
Blockly.UnLisp.scrub_ = function (block, code, optThisOnly) {
  var commentCode = ''
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText()
    if (comment) {
      comment = Blockly.utils.string.wrap(comment, Blockly.UnLisp.COMMENT_WRAP - 3)
      commentCode += Blockly.UnLisp.prefixLines(comment, '; ') + '\n'
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type === Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock()
        if (childBlock) {
          comment = Blockly.UnLisp.allNestedComments(childBlock)
          if (comment) {
            commentCode += Blockly.UnLisp.prefixLines(comment, '; ')
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock()
  var nextCode = optThisOnly ? '' : Blockly.UnLisp.blockToCode(nextBlock)
  return commentCode + code + nextCode
}

Blockly.UnLisp.cleanCode = function (src) {
  var dst = src
  dst = dst.replace(/(\r\n|\n|\r)/gm, ' ') // replace all newlines with spaces
  dst = dst.replace(/\s+/g, ' ').trim() // remove extra spaces
  dst = dst.replace(/\(?<=[(|[]\)\s+|\s+(?=[\]|)])/g, '') // remove all spaces before and after parentheses
  return dst
}

Blockly.UnLisp.pushPrimitive = function (name, params) {
  Blockly.UnLisp.primitivesNames_[name] = {
    name,
    params
  }
}

Blockly.UnLisp.getPrimitives = function () {
  var primitives = Blockly.UnLisp.primitivesNames_ ? Object.values(Blockly.UnLisp.primitivesNames_) : []
  return primitives
}

Blockly.UnLisp.checkChildrenType = function (block, fieldNames, type) {
  const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames]
  for (let i = 0; i < names.length; i++) {
    const target = block.getInputTargetBlock(names[i])
    if (!target) {
      return false
    }
    if (!target.outputConnection.check_) {
      return true
    }
    if (target.outputConnection.check_.indexOf(type) === -1) {
      return false
    }
  }
  return true
}

Blockly.UnLisp.existParentType_ = function (block, type) {
  var parent = block.parentBlock_
  if (!parent) {
    return null
  }
  if (type === parent.type) {
    return parent
  }
  return Blockly.UnLisp.existParentType_(parent, type)
}

Blockly.UnLisp.allUsedVarModelsExcept = function (ws, types) {
  const fillVariablesHash = function (hash, block) {
    var blockVariables = block.getVarModels()
    if (blockVariables) {
      for (var j = 0; j < blockVariables.length; j++) {
        var variable = blockVariables[j]
        var id = variable.getId()
        if (id) {
          hash[id] = variable
        }
      }
    }
    return !!blockVariables
  }

  types = Array.isArray(types) ? types : [types]
  var variableHash = Object.create(null)
  var blocks = ws.getAllBlocks(false)

  // Do not include these blocks
  blocks = blocks.filter(function (block) {
    return types.indexOf(block.type) === -1
  })

  blocks = blocks.filter(function (block) {
    // check if this block uses some variables, if so add all the variables to the hash table
    if (fillVariablesHash(variableHash, block)) {
      for (let i = 0; i < types.length; i++) {
        // check if the parent is one of excluded blocks
        var parent = Blockly.UnLisp.existParentType_(block, types[i])
        if (parent) {
          // subtract parent's variables from the found block
          var parentVariables = parent.getVarModels()
          for (let j = 0; j < parentVariables.length; j++) {
            const variable = parentVariables[j]
            delete variableHash[variable.getId()]
          }
          return false
        }
      }
    }
    return true
  })

  // Iterate through every block and add each variable to the hash.
  for (var i = 0; i < blocks.length; i++) {
    fillVariablesHash(variableHash, blocks[i])
  }
  // Flatten the hash into a list.
  var variableList = []
  for (var id in variableHash) {
    variableList.push(variableHash[id])
  }

  return variableList
}
