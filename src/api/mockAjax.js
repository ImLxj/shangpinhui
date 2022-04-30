// 对axios进行二次封装
import axios from 'axios'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const requests = axios.create({
  // 配置对象
  // baseURL是基础路径，发送请求的时候路径当中会出现/api/
  baseURL: '/mock/',
  // 配置超时时间
  timeout: 5000
})
requests.interceptors.request.use((config) => {
  // config:对置对象，对象里面有一个属性很重要，就是headers请求头
  // 进度条开始
  nprogress.start()
  return config
})
requests.interceptors.response.use((res) => {
  nprogress.done()
  return res.data
}, (error) => {
  return new Promise(new Error('faile'))
})
export default requests
