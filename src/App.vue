<template>
  <div id="app">
    <Header></Header>
    <!-- 路由组件 -->
    <router-view></router-view>
    <!-- 当时登录或注册组件隐藏Footer组件，当时home、search组件显示 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from './components/Header/index'
import Footer from './components/Footer/index'
export default {
  name: 'App',
  components: { Header, Footer },
  // 为了提高性能，将三级列表的请求只发送一次，因为不管是发送一次还是发送多次他里面的数据都是一样的
  // 发送请求，将获取到的数据放到state里面
  mounted() {
    this.$store.dispatch('getCategoryList')
  }
}
</script>

<style></style>
