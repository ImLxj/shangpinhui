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

五、Vuex状态管理器
