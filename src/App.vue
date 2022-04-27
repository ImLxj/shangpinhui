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
  components: { Header, Footer }
}
</script>

<style></style>
