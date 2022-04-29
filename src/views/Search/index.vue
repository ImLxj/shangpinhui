<template>
  <div>
    <type-nav></type-nav>
  </div>
</template>

<script>
export default {
  name: 'Search',
  mounted() {
    this.$store.dispatch('categoryList')
  }
}
</script>

<style></style>
