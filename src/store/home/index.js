// home的仓库
// 导入接口
import { requestsCategoryList, reqBannerList } from '@/api'
const state = {
  categoryList: [],
  bannerList: []
}
const getters = {}
const mutations = {
  GETCATEGORYLIST(state, data) {
    state.categoryList = data
  },
  GETBANNERLIST(state, data) {
    state.bannerList = data
  }
}
const actions = {
  async getCategoryList(context) {
    let { data: result } = await requestsCategoryList()
    context.commit('GETCATEGORYLIST', result)
  },
  async getBannerList(context) {
    let { data: result } = await reqBannerList()
    context.commit('GETBANNERLIST', result)
  }
}

// 对外暴露
export default {
  state,
  getters,
  mutations,
  actions
}
