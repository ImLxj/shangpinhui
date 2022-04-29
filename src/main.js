import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 将三级联动注册成为全局组件
import TypeNav from '@/components/TypeNav'
// 导入仓库
import store from '@/store'
// 注册全局组件传递两个参数，第一个参数是组件的名字，第二个参数是哪一个组件
Vue.component(TypeNav.name, TypeNav)

Vue.config.productionTip = false

new Vue({
  router,
  store, // 这时在组件实例对象上就会多出来一个$store
  render: h => h(App)
}).$mount('#app')
