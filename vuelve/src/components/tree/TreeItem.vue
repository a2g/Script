<script>
import Modal from '../Modal.vue'

export default {
  name: 'TreeItem', // necessary for self-reference
  components: {
    Modal
  },
  props: {
    theModelAsAProp: Object,
    baseUrl: {
      type: String,
      default: "http://localhost:5000/jig/exclusive-worlds/Highschool/12/svg?"
      //  default: "http://localhost:5000/jig/jigsaw/world-example/03/svg?"
    },
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
      
      <button v-if="!isFolder && !theModelAsAProp.isAGoalOrAuto" @click="showModal = true">Show</button>
     
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
      <li class="add" @click="addChild">+</li>
    </ul>
     <!-- use the modal component, pass in the prop -->
  <modal :show="showModal" 
  :displayString="theModelAsAProp.name"
  :svgProp="baseUrl + 'paramA='+theModelAsAProp.paramA+'&paramB='+theModelAsAProp.paramB"
  @close="showModal = false">
    <template #header>
      <h3>Map and path</h3>
    </template>
  </modal>
  </li>
 
</template>