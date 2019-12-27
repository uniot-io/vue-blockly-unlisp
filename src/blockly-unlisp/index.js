/* eslint import/no-webpack-loader-syntax: off */
import * as Blockly from 'blockly/core'
import UnlispToolbox from 'raw-loader!./toolbox/unlisp.xml'
import UnlispTheme from './theme/unlisp'

import './blocks/unlisp/lists'
import './blocks/unlisp/loops'
import './blocks/unlisp/math'
import './blocks/unlisp/procedures'
import './blocks/unlisp/special'
import './blocks/unlisp/text'

import './generators/unlisp'
import './generators/unlisp/lists'
import './generators/unlisp/logic'
import './generators/unlisp/loops'
import './generators/unlisp/math'
import './generators/unlisp/special'
import './generators/unlisp/text'
import './generators/unlisp/procedures'
import './generators/unlisp/variables'
import './generators/unlisp/variables_dynamic'

const BlocklyUnlisp = Blockly.UnLisp

export {
  BlocklyUnlisp,
  UnlispToolbox,
  UnlispTheme
}
