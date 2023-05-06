<script>
import Modal from '../Modal.vue'

export default {
  name: 'TreeItem', // necessary for self-reference
  components: {
    Modal
  },
  props: {
    theModelAsAProp: Object,
    showModal: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    isFolder() {
      return this.theModelAsAProp.children && this.theModelAsAProp.children.length
    }
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen
      }
    },
    changeType() {
      if (!this.isFolder) {
        this.theModelAsAProp.children = []
        this.addChild()
        this.isOpen = true
      }
    },
    addChild() {
      this.theModelAsAProp.children.push({
        name: 'new stuff'
      })
    }
  }
}
</script>

<template>
  <li>
    <div :class="{ bold: isFolder }" @click="toggle" @dblclick="changeType">
      {{ theModelAsAProp.name }}
      <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <!--
        A component can recursively render itself using its
        "name" option (inferred from filename if using SFC)
      -->
      <TreeItem class="item" v-for="subModel in theModelAsAProp.children" v-bind:key="subModel.id"
        v-bind:theModelAsAProp="subModel">
      </TreeItem>
      <li class="add" @click="showModal = true">Show Modal</li>
   
      <li class="add" @click="addChild">+</li>
    </ul>
     <!-- use the modal component, pass in the prop -->
  <modal :show="showModal" @close="showModal = false">
    <template #header>
      <h3>custom header</h3>
    </template>
  </modal>
  </li>
 
</template>