<template>
  <div id="app">
    <BlocklyComponent id="blockly" :options="options" ref="blockly"/>

    <p id="code">
      <button @click="showCode">Show UnLisp</button>
      <pre v-html="code"></pre>
    </p>
  </div>
</template>

<script>
import { BlocklyComponent, BlocklyUnlisp, UnlispToolbox, UnlispTheme } from './lib'

export default {
  name: 'example',
  components: {
    BlocklyComponent
  },

  data () {
    return {
      code: '',
      options: {
        grid:
          {
            spacing: 25,
            length: 3,
            colour: '#ccc',
            snap: true
          },
        toolbox: UnlispToolbox,
        theme: UnlispTheme,
        renderer: 'thrasos'
      }
    }
  },
  methods: {
    showCode() {
      this.code = BlocklyUnlisp.workspaceToCode(this.$refs['blockly'].workspace)
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
