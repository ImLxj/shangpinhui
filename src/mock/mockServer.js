// 引入mock模块
import Mock from 'mockjs'
// 引入json文件：在webpack当中默认图片、json数据文件不需要对外暴露
import banner from './banner.json'
import floor from './floors.json'

// 使用mock模拟数据，里面有一个mock()方法传递两个参数，第一个参数是路径，第二个参数是传递的对象
Mock.mock('/mock/banner', { code: 200, data: banner })
Mock.mock('/mock/floor', { code: 200, data: floor })
