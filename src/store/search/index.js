// search的仓库
import { reqSelectSearch } from '@/api'
const state = {
  searchList: {}
}
// 计算属性,为了简化仓库数据而生
const getters = {
  goodsList(state) {
    return state.searchList.goodsList || []
  },
  attrsList(state) {
    return state.searchList.attrsList || []
  },
  trademarkList(state) {
    return state.searchList.trademarkList || []
  }
}
const mutations = {
  GETSELECTSEARCH(state, data) {
    state.searchList = data
  }
}
const actions = {
  async getSearchList({ commit }, params = {}) {
    const { data: res } = await reqSelectSearch(params)
    commit('GETSELECTSEARCH', res)
  }
}

// 对外暴露
export default {
  state,
  getters,
  mutations,
  actions
}
