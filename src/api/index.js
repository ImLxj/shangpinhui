// 统一配置接口
import requests from './request'

// 对外暴露接口
export const requestsCategoryList = () => {
  // 发送请求
  return requests({
    url: 'product/getBaseCategoryList',
    method: 'GET',
  })
}
