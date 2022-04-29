// home的仓库
// 导入接口
import { requestsCategoryList } from '@/api'
const state = {
  categoryList: []
}
const getters = {}
const mutations = {
  CATEGORYLIST(state, data) {
    state.categoryList = data
  }
}
const actions = {
  async categoryList(context) {
    let { data: result } = await requestsCategoryList()
    context.commit('CATEGORYLIST', result)
  }
}

// 对外暴露
export default {
  state,
  getters,
  mutations,
  actions
}
