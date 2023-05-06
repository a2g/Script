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
        paramA: 'PARAM1',
        paramB: 'PARAM2',
        children: [
        ]
      }
    }
  },
  methods: {
    async awaitGetSolutionsAndSetToData (username) {
      this.treeData2 = await this.getSolutions(username)

      if (this.treeData2) {
        this.history.unshift(this.treeData2)
      }
    },
    
    async getSolutions (username) {
      try {
        const apiResp = await axios.get(`${API_BASE}/solutions/${username}`)
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
    <button @click="awaitGetSolutionsAndSetToData"> blah </button>
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
