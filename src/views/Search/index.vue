<template>
  <div>
    <h2>params参数：{{$route.params.keyword}}</h2>
    <h2>query参数：{{$route.query.keyword}}</h2>
  </div>
</template>

<script>
export default {
  name: 'Search'
}
</script>

<style></style>
