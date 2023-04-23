<script>

import Example from './components/Example.vue'
import Tree from './components/Tree.vue'

export default {
  name: 'App',
  components: {
    Example,
    Tree
  }
}
</script>

<template>
  <div id="app">
    <h1>Title is set in App.vue </h1>
    <tree />
    <example />
  </div>
</template>

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