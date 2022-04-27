import Vue from 'vue'
import VueRouter from 'vue-router'
// 使用插件
Vue.use(VueRouter)

import Home from '@/views/Home'
import Search from '@/views/Search'
import Login from '@/views/Login'
import Register from '@/views/Register'

const routes = [
  { path: '*', redirect: '/home' },
  { path: '/home', component: Home, meta: { show: true } },
  { path: '/search/:keyword', name: 'search', component: Search, meta: { show: true } },
  { path: '/login', component: Login, meta: { show: false } },
  { path: '/register', component: Register, meta: { show: false } },
]

const router = new VueRouter({
  routes
})

export default router
