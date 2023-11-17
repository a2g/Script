<script> 
import axios from 'axios'
import TreeItem from './tree/TreeItem.vue'

const API_BASE = location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : location.origin


export default {
  // global awareness
  name: 'Tree',

  // template dependencies
  components: {
    TreeItem
  },

  // interface
  props: {
  },
  // local state
  data() {
    return {
      treeData2: {
        name: 'nothing yet',
        isAGoalOrAuto: true,
        paramA: 'set in Tree.vue',
        paramB: 'also set in Tree.vue',
        children: [
        ]
      },
      starters: []
    }
  },
  // non-reactive properties
  methods: {
   
    async awaitGetSolutionsAndSetToData (repoSlashWorldSlashArea) {
      this.treeData2 = await this.getSolutions(repoSlashWorldSlashArea)

      if (this.treeData2) {
        this.history.unshift(this.treeData2)
      }
    },

    async awaitGetStartersAndSetToData () {
      try {
        const response = await axios.get(`${API_BASE}/puz/starters`)
        this.starters = response.data
      } catch (err) {
        console.log(err)
      }
    },
    
    async getSolutions (repoSlashWorldSlashArea) {
      try {
        const response = await axios.get(`${API_BASE}/puz/${repoSlashWorldSlashArea}/sols`)
        // const responseTime = apiResp.headers['x-response-time']
        const data = response.data

        if (!data.cached) {
          // storeGithubAccessTimeForUser(data.username, responseTime)
        }

        return data
      } catch (err) {
        console.log(err)
        // catch err
      }
    },
  },
}
</script>

<template>
  <div>
    <button @click="awaitGetStartersAndSetToData">get Starters</button>
    <ul>
      <li v-for="starter in starters" :key="starter.name">  
        <button @click="awaitGetSolutionsAndSetToData(starter.repoSlashWorldSlashArea)" :value="starter.repoSlashWorldSlashArea">{{starter.world}} {{starter.area}}</button>
      </li>
    </ul>
  <ul>
    <td></td>
    <TreeItem class="item" v-bind:theModelAsAProp="treeData2"></TreeItem>
  </ul>
</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.example {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
}

.note {
  margin-top: 5rem;
  font-weight: bold;
  background: #fceca9;
  padding: 0.5rem 1rem;
  text-align: center;
}

.how-it-works {
  margin-top: 2rem;
}

.how-it-works .how-it-works__header {
  font-weight: bold;
  font-size: 20px;
}

.how-it-works .how-it-works__content {
  font-size: 20px;
  text-align: left;
}
</style>
