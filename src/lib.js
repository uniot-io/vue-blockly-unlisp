/* eslint import/no-webpack-loader-syntax: off */

import BlocklyComponent from './components/BlocklyComponent'
import BlocklyUnlisp from './blockly-unlisp'
import UnlispToolbox from 'raw-loader!./toolbox/unlisp.xml'

const BlocklyRegisterIgnoredElements = (Vue) => {
  Vue.config.ignoredElements.push('field', 'block', 'category', 'xml', 'mutation', 'value', 'sep')
}

export {
  BlocklyComponent,
  BlocklyUnlisp,
  UnlispToolbox,
  BlocklyRegisterIgnoredElements
}
