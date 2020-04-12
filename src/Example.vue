<template>
  <div id="app">
    <BlocklyComponent id="blockly" :options="options" :scheme="scheme" ref="blockly" @change="onChange"/>

    <p id="code">
      <button @click="showCode">Show UnLisp</button>
      <pre v-html="code"></pre>
    </p>
  </div>
</template>

<script>
import { BlocklyComponent } from './lib'

export default {
  name: 'example',
  components: {
    BlocklyComponent
  },

  data () {
    return {
      scheme: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="text_print" id="zP!pksG8l,GYkJw/jF6M" x="163" y="263"><value name="TEXT"><shadow type="text" id="p[YBSW4Nc1Etc.rpscUi"><field name="TEXT">abc</field></shadow></value></block></xml>',
      code: '',
      options: {
        grid: {
          colour: '#faa'
        }
      }
    }
  },
  methods: {
    showCode () {
      this.code = this.$refs.blockly.getCode()
      this.code += '\n\n'
      this.code += `Primitives:\n${JSON.stringify(this.$refs.blockly.getPrimitives(), null, 2)}`
    },

    onChange (event) {
      const ignoredEvent = this.$refs.blockly.getBlockly().Events.UI;
      if (event.type !== ignoredEvent) {
        // eslint-disable-next-line no-console
        console.log(event.type)
        this.showCode()
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html, body {
  margin: 0;
}

#code {
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  margin: 0;
  background-color: beige;
}

#blockly {
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
}
</style>
