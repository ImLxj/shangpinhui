<template>
  <div>
    <type-nav></type-nav>
    <list-container></list-container>
    <today-recommend></today-recommend>
    <Rank />
    <Like />
    <Floor />
    <Brand />
  </div>
</template>

<script>
// 引入其他静态组件
import ListContainer from '@/views/Home/ListContainer'
import TodayRecommend from '@/views/Home/TodayRecommend'
import Rank from '@/views/Home/Rank'
import Like from '@/views/Home/Like'
import Floor from '@/views/Home/Floor'
import Brand from '@/views/Home/Brand'

export default {
  name: 'Home',
  components: {
    ListContainer,
    TodayRecommend,
    Rank,
    Like,
    Floor,
    Brand
  }
}
</script>

<style></style>
