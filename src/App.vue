<template>
  <div id="app">
    <img src="assets/logo.png" >
    <h1>Welcome to Your Vue.js App</h1>
    <Items />
  </div>
</template>

<script>
import Items from './components/Items'

export default {
  name: 'app',
  components: {
    Items
  }
}
</script>
