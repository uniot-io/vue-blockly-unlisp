import Vue from 'vue'
import Example from './Example.vue'
import { BlocklyRegisterIgnoredElements } from './lib'

Vue.config.productionTip = false
BlocklyRegisterIgnoredElements(Vue)

new Vue({
  render: h => h(Example)
}).$mount('#app')
