import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Search from '@/views/Search'
import Login from '@/views/Login'
import Register from '@/views/Register'

// 使用插件
Vue.use(VueRouter)

// 先保存一份$router.push方法
const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace
// 重写push|replace方法
/*
  传递三个参数，第一个是要跳转的信息，第二个是跳转成功之后的回调，第三个是跳转失败的回调
  push这个函数的上下文是组件实例对象当中的$router,this.$router就是VueRouter对象
*/
/*
  call和apply的相同点和不通点
  相同点：call和apply都可以执行一次函数，并篡改该函数的this指向
  不同点：call传递参数用逗号隔开，apply传递参数要使用数组。
*/
VueRouter.prototype.push = function (location, resolve, reject) {
  // 如果用户传递了成功之后的回调和失败之后的回调就执行push
  if (resolve && reject) {
    // 单独调用originPush函数他的this指向是window
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}

const routes = [
  { path: '*', redirect: '/home' },
  { path: '/home', component: Home, meta: { show: true } },
  { path: '/search', name: 'search', component: Search, meta: { show: true } },
  { path: '/login', component: Login, meta: { show: false } },
  { path: '/register', component: Register, meta: { show: false } },
]

const router = new VueRouter({
  routes
})

export default router
