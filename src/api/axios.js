// 对axios进行二次封装
import axios from 'axios'
// 引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

// 利用axios对象的create方法创建一个axios实例
// requests就是axios，只是把它配置一下
const requests = axios.create({
  // 配置对象
  // baseURL是基础路径，发送请求的时候路径当中会出现/api/
  baseURL: '/api/',
  // 配置超时时间
  timeout: 5000
})
// 请求拦截器: 在发送请求之前，请求拦截器可以监测到、可以在发送请求之前做一些事情
requests.interceptors.request.use((config) => {
  // config:对置对象，对象里面有一个属性很重要，就是headers请求头
  // 进度条开始
  nprogress.start()
  return config
})
// 响应拦截器
requests.interceptors.response.use((res) => {
  // 成功之后的回调：服务器响应回来的数据响应拦截器可以检测的到。
  // 进度条结束
  nprogress.done()
  return res.data
}, (error) => {
  // 响应失败之后的回调
  return new Promise(new Error('faile'))
})

// 对外暴露axios
export default requests
