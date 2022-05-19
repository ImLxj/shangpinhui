<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件的委派|事件的委托 -->
      <div @mouseleave="removeBackground" @mouseenter="enterList">
        <h2 class="all">全部商品分类</h2>
        <transition name="sort">
          <div class="sort" v-show="show">
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="index"
                :class="{ cur: currentIndex === index }"
              >
                <h3 @mouseenter="changeBackground(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <div
                  class="item-list clearfix"
                  :style="{
                    display: currentIndex === index ? 'block' : 'none'
                  }"
                >
                  <div
                    class="subitem"
                    v-for="(c2, c2Index) in c1.categoryChild"
                    :key="c2Index"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryChild"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em
                          v-for="c3 in c2.categoryChild"
                          :key="c3.categoryChild"
                        >
                          <a
                            :data-categoryName="c2.categoryName"
                            :data-category3Id="c2.categoryChild"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// 按需引入lodash
import throttle from 'lodash/throttle'
export default {
  name: 'TypeNav',
  data() {
    return {
      currentIndex: -1,
      show: true
    }
  },
  // 当进入search页面的时候自动将三级联动菜单隐藏
  mounted() {
    if (this.$route.path !== '/home') {
      this.show = false
    }
  },
  methods: {
    // 一级标题的鼠标进入改变背景颜色
    // 将一级联动的鼠标移入事件节流
    // throttle尽量不要用箭头函数，可能会出现上下文this问题
    changeBackground: throttle(function (index) {
      this.currentIndex = index
    }, 50),
    // 一级标题鼠标移出改变背景颜色，鼠标移入隐藏三级联动菜单
    removeBackground() {
      this.currentIndex = -1
      if (this.$route.path !== '/home') {
        this.show = false
      }
    },
    // 鼠标移入显示三级联动菜单
    enterList() {
      this.show = true
    },
    // 通过编程式导航 + 事件委派的形式实现三级联动跳转search组件，但是可能会出现以下的问题：
    // 1：怎么传递【1、2、3级不同菜单的参数】 2：怎么能够知道是点击的a标签进行的跳转。
    goSearch(event) {
      // this.$router.push('/search')
      // 第一个问题：怎么判断是不是a标签
      /*
        通过给a标签添加自定义属性，当用户点击a标签的时候来判断当前点击的节点里面存不存在设置的自定义属性
        如果有则就是a标签,当点击触发事件的时候会传递一个event参数，event参数里面有target属性可以获取到当前点击的节点
      */
      let element = event.target
      // 每个节点身上都有一个dataset属性，可以获取到当前节点的自定义属性
      let { categoryname, category1id, category2id, category3id } =
        element.dataset
      let location = { name: 'search' }
      let query = { categoryName: categoryname }
      //如果当前节点里面含有categoryname这个自定义属性则一定是a标签
      if (categoryname) {
        // 不管点击一级、二级、三级分类a标签
        if (category1id) {
          query.category1Id = category1id
        } else if (category2id) {
          query.category2Id = category2id
        } else {
          query.category3Id = category3id
        }
        location.query = query
        // 跳转路由，在跳转之前要判断路由里面有没有params参数，如果有params参数则合并到一起
        // 路由是应用于所有的路由组件，往哪个组件跳转传递的参数就在那个组件里面
        if (this.$route.params) {
          location.params = this.$route.params
          this.$router.push(location)
        }
      }
    }
  },
  // 获取到home仓库里面的数据
  computed: {
    // ...mapState要在计算属性里面使用，他的返回值就是vuex里面的state保存的数据
    ...mapState({
      // 使用对象形式左边式一个函数，这个函数会被调用一次
      // 还会默认传入一个参数，这个参数就是大仓库的state
      categoryList: (state) => state.home.categoryList
    })
  }
}
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;
      // overflow: hidden;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 27px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
      }
    }
    // 进入的起点
    .sort-enter {
      height: 0px;
    }
    // 进入的过程
    .sort-enter-active {
      transition: all 0.5s linear;
    }
    // 进入的终点
    .sort-enter-to {
      height: 461px;
    }
    // 离开的起点
    .sort-leave {
      height: 461px;
    }
    // 离开的过程
    .sort-leave-active {
      transition: all 0.5s linear;
    }
    // 离开的终点
    .sort-leave-to {
      height: 0px;
    }
  }
}
</style>
