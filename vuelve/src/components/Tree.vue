<script> 
import axios from 'axios'
import TreeItem from './tree/TreeItem.vue'

const API_BASE = location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : location.origin


export default {
  name: 'Tree',

  components: {
    TreeItem
  },

  props: {
  },
  data() {
    return {
      treeData2: {
        name: 'nothing yet',
        isAGoalOrAuto: true,
        paramA: 'set in Tree.vue',
        paramB: 'also set in Tree.vue',
        children: [
        ]
      }
    }
  },
  methods: {
    async awaitGetSolutionsAndSetToData () {
      const repo = 'exclusive-worlds'
      const world = 'Highschool'
      const area = '12'
      this.treeData2 = await this.getSolutions(repo, world, area)

      if (this.treeData2) {
        this.history.unshift(this.treeData2)
      }
    },
    
    async getSolutions (repo, world, area) {
      try {
        const apiResp = await axios.get(`${API_BASE}/jig/${repo}/${world}/${area}/sols`)
       // const responseTime = apiResp.headers['x-response-time']
        const data = apiResp.data

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
    <button @click="awaitGetSolutionsAndSetToData"> getSolutions </button>
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
