import BlocklyComponent from './components/BlocklyComponent'
import {
  BlocklyUnlisp,
  UnlispToolbox,
  UnlispTheme
} from './blockly-unlisp'

const BlocklyRegisterIgnoredElements = (Vue) => {
  Vue.config.ignoredElements.push('field', 'block', 'category', 'xml', 'mutation', 'value', 'sep')
}

export {
  BlocklyComponent,
  BlocklyUnlisp,
  UnlispToolbox,
  UnlispTheme,
  BlocklyRegisterIgnoredElements
}
