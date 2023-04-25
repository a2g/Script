<script>
export default {
  name: 'Panel',

  components: {
  },

  props: {
    usernames: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
  }),
}
</script>

<template>
  <div class="panel mt-5">
    <span>Or, select one of these</span>
    <br/>
    <span>repo names</span>

    <div
      v-for="(name, index) in usernames"
      :key="index"
    >
      <a
        href="#"
        class="ml-3 mr-1"
        @click="$emit('search', name)"
      >{{ name }}</a> 
    </div>
  </div>
</template>


<style scoped>
.panel {
}
</style>
