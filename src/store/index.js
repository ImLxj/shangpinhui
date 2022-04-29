import Vue from 'vue'
import Vuex from 'vuex'

// 使用Vuex
Vue.use(Vuex)
// 引入小仓库
import home from './home'
import search from './search'

// 对外暴露Vuex的store实例对象
export default new Vuex.Store({
  modules: {
    home,
    search
  }
})
