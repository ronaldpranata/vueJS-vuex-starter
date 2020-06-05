<template>
  <ul>
    <li v-for="(item, index) in items" :key="index" class="items">
      {{ item }}
    </li>
  </ul>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  export default {
    mounted () {
      this.setItems()
    },
    methods: {
      ...mapActions(['setItems'])
    },
    computed: {
      ...mapGetters(['items'])
    }
  }
</script>