import BlocklyComponent from './components/BlocklyComponent'

const BlocklyRegisterIgnoredElements = (Vue) => {
  Vue.config.ignoredElements.push('field', 'block', 'category', 'xml', 'mutation', 'value', 'sep')
}

export {
  BlocklyComponent,
  BlocklyRegisterIgnoredElements
}
