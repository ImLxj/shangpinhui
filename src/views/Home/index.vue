<template>
  <div>
    <type-nav></type-nav>
    <list-container></list-container>
    <today-recommend></today-recommend>
    <Rank />
    <Like />
    <Floor v-for="item in floorList" :key="item.id" :floor="item" />
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
import { mapState } from 'vuex'
export default {
  name: 'Home',
  components: {
    ListContainer,
    TodayRecommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  mounted() {
    this.$store.dispatch('getFloorList')
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList
    })
  }
}
</script>

<style></style>
