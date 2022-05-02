// home的仓库
// 导入接口
import { requestsCategoryList, reqBannerList, reqFloorList } from '@/api'
const state = {
  categoryList: [],
  bannerList: [],
  floorList: []
}
const getters = {}
const mutations = {
  GETCATEGORYLIST(state, data) {
    state.categoryList = data
  },
  GETBANNERLIST(state, data) {
    state.bannerList = data
  },
  GETFLOORLIST(state, data) {
    state.floorList = data
  }
}
// 用来处理异步操作
const actions = {
  async getCategoryList(context) {
    let { data: result } = await requestsCategoryList()
    context.commit('GETCATEGORYLIST', result)
  },
  async getBannerList(context) {
    let { data: result } = await reqBannerList()
    context.commit('GETBANNERLIST', result)
  },
  async getFloorList(context) {
    let { data: result } = await reqFloorList()
    context.commit('GETFLOORLIST', result)
  }
}

// 对外暴露
export default {
  state,
  getters,
  mutations,
  actions
}
