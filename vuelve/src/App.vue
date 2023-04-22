<template>
  <div id="app">
    <h1>Redis Caching Example</h1>
    <ul>
    <TreeItem class="item" :model="treeData"></TreeItem>
  </ul>
    <example />
  </div>
</template>

<script>
import TreeItem from './components/TreeItem.vue'
import Example from './components/Example.vue'

const treeData = {
  name: 'My Tree',
  children: [
    { name: 'hello' },
    { name: 'wat' },
    {
      name: 'child folder',
      children: [
        {
          name: 'child folder',
          children: [{ name: 'hello' }, { name: 'wat' }]
        },
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [{ name: 'hello' }, { name: 'wat' }]
        }
      ]
    }
  ]
}

export default {
  name: 'App',
  components: {
    Example,
    TreeItem
  },
  data() {
    return {
      treeData
    }
  }
}
</script>

<style>
.item {
  cursor: pointer;
  line-height: 1.5;
}
.bold {
  font-weight: bold;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>