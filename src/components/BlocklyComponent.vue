<template>
  <div>
    <div class="blockly-div" ref="blockly-div">
    </div>
    <xml ref="blockly-toolbox" style="display:none">
      <slot></slot>
    </xml>
  </div>
</template>

<script>
import Blockly from 'blockly'

let BlocklyComponent = {
  name: 'BlocklyComponent',
  props: ['options'],

  data () {
    return {
      workspace: null
    }
  },

  mounted () {
    var options = this.$props.options || {}
    if (!options.toolbox) {
      options.toolbox = this.$refs["blockly-toolbox"]
    }
    this.workspace = Blockly.inject(this.$refs["blockly-div"], options)
  }
}

export default BlocklyComponent
</script>

<style scoped>
.blockly-div {
  height: 100%;
  width: 100%;
  text-align: left;
}
</style>
