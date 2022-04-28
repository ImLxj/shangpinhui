import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 将三级联动注册成为全局组件
import TypeNav from '@/views/Home/TypeNav'
// 注册全局组件传递两个参数，第一个参数是组件的名字，第二个参数是哪一个组件
Vue.component(TypeNav.name, TypeNav)
// 调用接口
import { requestsCategoryList } from '@/api'
requestsCategoryList()
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
