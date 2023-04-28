<script>
import Example from './components/Example.vue'
import Tree from './components/Tree.vue'
import Modal from './components/Modal.vue'

export default {
  name: 'App',
  
  components: {
    Example,
    Tree,
    Modal
  },
  data() {
    return {
      showModal: false
    }
  }
}
</script>

<template>
  <div id="app">
    <h1>Title is set in App.vue </h1>
    <button id="show-modal" @click="showModal = true">Show Modal</button>
    <tree />
    <example />
    <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3>custom header</h3>
      </template>
    </modal>
  </Teleport>
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