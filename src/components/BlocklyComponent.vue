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

  methods: {
    resize () {
      Blockly.svgResize(this.workspace)
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

<style>
.blocklyToolboxDiv {
  background-color: #EAECF0;
}

.blocklyFlyoutBackground {
  fill: #EAECF0;
}

.blocklyIconShape {
  fill: #4263a5;
}

.blocklyCommentTextarea {
  background-color: #FCF1D8;
}

.blocklyFlyoutButton {
  fill: #8DA1B9;
}

.blocklyFlyoutButton:hover {
  fill: #a2b7d0;
}

.blocklySelected>.blocklyPath {
  stroke: rgb(90, 90, 90);
  stroke-width: 2px;
  stroke-dasharray: 3;
  animation: dash 120s linear;
}

.blocklyHighlightedConnectionPath {
  stroke: rgb(90, 90, 90);
  stroke-width: 3px;
  stroke-dasharray: 3;
  animation: dash 70s linear;
}

@keyframes dash {
  to {
    stroke-dashoffset: 1000;
  }
}
</style>