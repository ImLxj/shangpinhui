// 统一配置接口
import requests from './axios'
import mockRequest from './mockAjax'
// 对外暴露接口
export const requestsCategoryList = () => {
  // 发送请求
  return requests({
    url: 'product/getBaseCategoryList',
    method: 'GET'
  })
}
// 获取banner数据
export const reqBannerList = () => mockRequest.get('banner')
// 获取floor数据
export const reqFloorList = () => mockRequest.get('floor')
