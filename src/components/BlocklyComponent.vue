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
    },

    serialize () {
      const xml = Blockly.Xml.workspaceToDom(this.workspace)
      return Blockly.Xml.domToText(xml)
    },

    deserialize (value) {
      const xml = Blockly.Xml.textToDom(value)
      Blockly.Xml.domToWorkspace(xml, this.workspace)
    },

    injectCustomFilter () {
      const defs = document.getElementsByTagName('defs')[0]
      if (defs) {
        const rnd = String(Math.random()).substring(2)
        const customFilter = Blockly.utils.dom.createSvgElement('filter',
          { 'id': 'customFilter' + rnd },
          defs)
        Blockly.utils.dom.createSvgElement('feMorphology',
          { 'in': 'SourceAlpha', 'operator': 'erode', 'radius': 1, 'result': 'erode1' },
          customFilter)
        Blockly.utils.dom.createSvgElement('feFlood',
          { 'flood-color': '#fff', 'flood-opacity': '0.4', 'result': 'flood1' },
          customFilter)
        Blockly.utils.dom.createSvgElement('feComposite',
          {
            'in': 'flood1',
            'in2': 'erode1',
            'operator': 'in',
            'result': 'specOut'
          },
          customFilter)
        const feMerge = Blockly.utils.dom.createSvgElement('feMerge',
          {},
          customFilter)
        Blockly.utils.dom.createSvgElement('feMergeNode',
          { 'in': 'SourceGraphic' },
          feMerge)
        Blockly.utils.dom.createSvgElement('feMergeNode',
          { 'in': 'specOut' },
          feMerge)
        return customFilter.id
      }
      return null
    }
  },

  mounted () {
    var options = this.$props.options || {}
    if (!options.toolbox) {
      options.toolbox = this.$refs["blockly-toolbox"]
    }
    this.workspace = Blockly.inject(this.$refs["blockly-div"], options)
    Blockly.BlockSvg.START_HAT = true
    const filterId = this.injectCustomFilter()
    if (filterId) {
      this.workspace.options.embossFilterId = filterId
    }
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
.blocklyMinimalBody {
  background: unset !important;
  padding: 2px !important;
}

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
  border-radius: 3px;
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