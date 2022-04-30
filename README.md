### 学习笔记

#### 一、编程式路由导航的跳转

编程式路由跳转到当前路由（参数不变），多次执行会抛出NavigationDuplicated的警告错误？

- 路由跳转有两种形式：声明式导航、编程式导航

  - 声明式导航没有这类的错误，因为vue-router的底层已经处理好了。

- 为什么编程式导航进行路由跳转的时候，就有这种错误警告？

  - `vue-router:"^3.5.3"`之后最新的vue-router引入了promise

- 通过给push|replace方法传递响应的成功、失败的回调函数可以捕获到当前错误，可以解决。

  - 通过底部的代码，可以实现解决错误

  ```js
  this.$router.push(
      {
          name: 'search',
          params: {
              keyword: this.keyword
          },
          query: {
              keyword: '1123'
          }
      },
      // 成功之后的回调
      () => {},
      // 失败的回调
      () => {}
  )
  ```

  - 但是这种写法治标不治本，将来在别的组件当中使用push|replace的时候还会有这种错误出现。

- `this`表示当前的组件的实例。

- `this.$router`属性：当前的这个属性，属性值是VueRouter类的一个实例对象，当在入口文件注册路由的时候，给组件实例添加的`$router|$route`属性。

- push|replace：VueRouter类的一个实例

  ```js
  function VueRouer(){}
  // 原型对象上的方法
  VueRouter.prototype.push = function(){}
  let $router = new VueRouter()
  $router.push()
  ```

- push是VueRouter类原型的一个方法，`$router`是VueRouter类的实例，类的实例可以直接调用类的原型上的方法，当我们对原型上的方法进行修改的时候，修改过后的结果可以直接作用域组件实例上的$router实例。

![image-20220428145136110](E:\学习\项目实战\尚品汇\project-shop\image-20220428145136110.png)

- 当组件的`this.$router.push`想要页面跳转的时候，当前push函数或者方法里面的this指向就是`this.$router`或者说是`VueRouer`的实例对象。

- 这样我们需要重写`push|replace`方法，我们是在原有的基础上加一些东西，所以需要先把`push|replace`方法保存一份。

  ```js
  // 先保存一份$router.push方法、$router.replace
  const originPush = VueRouter.prototype.push
  const originReplace = VueRouter.prototype.replace
  ```

- 重写push|replace方法

  ```js
  /*
  	第一个参数：路由要跳转的路径
  	第二个参数：路由成功的回调
  	第三个参数：路由失败的回调
  */
  VueRouter.prototype.push = function (location, resolve, reject) {
    // 如果用户传递了成功之后的回调和失败之后的回调就执行push
    if (resolve && reject) {
      // 单独调用originPush函数他的this指向是window
      originPush.call(this, location, resolve, reject)
    } else {
      originPush.call(this, location, () => { }, () => { })
    }
  }
  VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
      originPush.call(this, location, resolve, reject)
    } else {
      originPush.call(this, location, () => { }, () => { })
    }
  }
  ```

- call和apply的区别

  - 相同点：
    - call和apply都篡改函数的this指向。
    - call和apply都可以执行一次函数。
  - 不同点：
    - call传参是通过逗号隔开、apply是通过数组。



#### 二、Home组件模块的拆分

- 静态页面完成
- 将静态页面拆分为组件
- 获取服务器的数据进行展示
- 动态业务

​	1、三级联动组件

​		--- 因为三级联动逐渐在Home组件、Search、Detail这些组件当中都含有，所以将三级联动组件注册成一个全局组件。

```js
// 将三级联动注册成为全局组件
import TypeNav from '@/views/Home/TypeNav'
// 注册全局组件传递两个参数，第一个参数是组件的名字，第二个参数是哪一个组件
Vue.component(TypeNav.name, TypeNav)
```

#### 三、axios的二次封装

- XHLHTTPRequest、fetch、JQ、axios

- 为什么需要进行二次封装axios？

  - 请求拦截器、响应拦截器：请求拦截器，可以在发送请求之前可以处理一些业务、响应拦截器，当服务器数据返回以后，可以处理一些事情。

- 在项目当中经常API文件夹【axios】

  - 在接口当中有重复的路径可以使用baseUrl来配置

- 接口统一管理

  - 项目小：通过vue的生命周期函数发送请求
  - 项目大：统一配置接口文件

- 接口的跨域问题

  - 跨域问题是协议不同、地址不同、端口号不同会产生跨域

  - cors、代理、jsonp

    ```js
    // 通过webpack代理服务器
    // 服务器和服务器之间不存在跨域请求，只有客户端和服务器存在跨域。
    // 在vue.config.js配置文件里面 这个文件就相当于webpack.config.js
    devServer: {
        proxy: {
          '/api/': {
            target: 'http://gmall-h5-api.atguigu.cn'
          }
        }
      }
    ```

#### 四、nprogress进度条的使用

下载：`npm i --save nprogress`

```js
// 引入进度条
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

// 请求拦截器里面
// 进度条开始
  nprogress.start()
// 响应拦截器里面
// 进度条结束
  nprogress.done()
```

#### 五、Vuex状态管理器

vuex就是vue官方提供的可以统一管理数据的插件。

#### 六、卡顿现象

- 正常：事件触发非常频繁，而且每一次的触发，回调函数都要去执行（如果时间很短，而回调函数内部有计算，那么很可能出现浏览器卡顿）。
- 节流：在规定的间隔事件范围内不会重复触发回调，只有大于这个时间间隔才会去触发回调，把频繁触发变为少量触发。
- 防抖：前面的所有触发都被取消。最后一次执行在规定的时间之后才会触发，也就是说如果连续快速的触发只会执行一次。
- lodash插件里面封装了节流和防抖可以直接拿过来使用。

#### 七、三级联动路由跳转传参

- 三级联动分为：一级标题、二级标题、三级标题

- 当用户点击：Home模块跳转到search模块、以及会把选中的产品(产品名字、产品id)在路由跳转的时候进行参数传递。

- 实现方法：将a标签设置自定义样式通过事件传递的event参数来获取当前的节点，每个节点里面有dataset属性可以获取自定义样式，判断有没有自定义样式开确定a标签和传递参数。

  ```js
  goSearch(event) {
        let element = event.target
        let { categoryname, category1id, category2id, category3id } =
          element.dataset
        let location = { name: 'search' }
        let query = { categoryName: categoryname }
        if (categoryname) {
          if (category1id) {
            query.category1Id = category1id
          } else if (category2id) {
            query.category2Id = category2id
          } else {
            query.category3Id = category3id
          }
          location.query = query
          this.$router.push(location)
        }
      }
  ```

#### 八、过渡动画

​	过渡动画前提是一个组件|标签有v-if|v-show属性才可以使用

​	过渡动画:

```vue
// template里面
<template>
	<!-- xxxx 表示css样式名,前提transition嵌套的子元素里面必须含有v-if或v-show -->
    <transition name="xxx">
    	<div v-show="show"></div>
    </transition>
</template>
<style>
    .xxx-enter{} // 进入的起点
    .xxx-enter-active{} // 进入的过程
    .xxx-enter-to{} // 进入的终点
    
    .xxx-leave{} // 离开的起点
    .xxx-leave-active{} // 离开的过程
    .xxx-leave-to{} // 离开的终点
</style>
```

#### 九、优化三级联动列表

`type-nav`组件的作用是将home仓库里面的数据渲染到页面，在`home`组件当中通过dispatch来触发actions配置项，来改变home仓库里面的源数据实现页面的渲染，但是这样做，每次跳转到home页面都会从新发送一次请求，会影响性能，因为所需要的数据请求一次和请求多次数据的内容是一样的，这样我们通过根组件`app`来发送请求，因为app在整个过程中只会挂载一次。这样就解决了性能的问题。

#### 十、合并query参数和params参数

1. 第一种情况：先在搜索框输入内容点击搜索跳转到search组件，组件里面会`this.$route`会有params参数。然后点击三级联动列表跳转search标签传递query参数，会将原有的params替换为空对象。

2. 第二种情况：先点击三级联动标签跳转search组件，传递query参数，然后在搜索框输入内容点击搜索跳转传递params参数，会把query参数顶替掉。

3. 综上：这样我们在两种跳转之前做出判断，看看要跳转前`this.$route`里面有没有**query参数**或<b>query参数</b>

   ```js
   // 在Header组件里面判断当前this.$route对象里面有没有query参数
   if (this.$route.query) {
       let location = {
           name: 'search',
           params: {
               keyword: this.keyword || undefined
           }
       }
       location.query = this.$route.query
       this.$router.push(location)
   }
   // 在type-nav组件里面判断当前的this.$route对面里面的params参数
   if (this.$route.params) {
       location.params = this.$route.params
       this.$router.push(location)
   }
   ```

   

#### 十一、mock插件的使用

```cmd
// 安装问题，官网上没有--legacy-peer-deps 我提示了报错，加上就可以下载了
npm install mockjs --legacy-peer-deps
```

使用步骤：

1. 在src目录下创建mock文件夹。
2. 准备json数据。
3. 把mock里面所需要的图片资源放到public文件夹下面，在打包的时候图片资源会原封不动的放大dist文件夹里面。
4. 使用mockjs模块实现虚拟数据。创建**mockServer.js**文件模拟数据。
5. 要在入口文件导入**mockServer.js**，这样是为了让这个js文件能够执行一次。

注意：请求mock数据不会向后端发送请求，请求会被浏览器拦截。

#### 十二、Swiper插件的使用

安装：

```
npm i swiper@5 --legacy-peer-deps // 默认安装最新版的最新版的可能会有问题
```

步骤：

1. 引入swiper包

   ```js
   import swiper from 'swiper'
   ```

2. 引入样式

   ```js
   // 在入口问卷全局引入样式
   import 'swiper/css/swiper.css'
   ```

3. 搭建结构
