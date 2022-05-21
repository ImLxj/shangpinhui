<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchList.categoryName">
              {{ searchList.categoryName }}<i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchList.keyword">
              {{ searchList.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌的面包屑 -->
            <li class="with-x" v-if="searchList.trademark">
              {{ searchList.trademark.split(':')[1]
              }}<i @click="removeTrademark">×</i>
            </li>
            <!-- 商品属性的面包屑 -->
            <li
              class="with-x"
              v-for="(item, index) in searchList.props"
              :key="index"
              @click="removeAttr(index)"
            >
              {{ item.split(':')[1] }}<i @click="removeTrademark">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOne }">
                  <a href="#" @click.prevent="changeOrder('1')"
                    >综合
                    <template v-if="isOne">
                      <span v-if="isAsc">⬆</span>
                      <span v-else>⬇</span>
                    </template>
                  </a>
                </li>
                <li></li>
                <li :class="{ active: isTwo }">
                  <a href="#" @click.prevent="changeOrder('2')"
                    >价格
                    <template v-if="isTwo">
                      <span v-if="isAsc">⬆</span>
                      <span v-else>⬇</span>
                    </template>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${goods.id}`"
                      ><img :src="goods.defaultImg"
                    /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>&nbsp;{{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" :title="goods.title">{{
                      goods.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination
            :pageNo="searchList.pageNo"
            :pageSize="searchList.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Search',
  components: {
    SearchSelector
  },
  data() {
    return {
      searchList: {
        category3Id: '',
        categoryName: '',
        keyword: '',
        // 默认是综合且降序
        order: '1:asc',
        pageNo: 8,
        pageSize: 1,
        props: [],
        trademark: ''
      }
    }
  },
  beforeMount() {
    // 在发请求之前将需要传递给接口的数据进行整理
    Object.assign(this.searchList, this.$route.query, this.$route.params)
  },
  mounted() {
    this.getSearchData()
  },
  methods: {
    getSearchData() {
      this.$store.dispatch('getSearchList', this.searchList)
    },
    getEmpty() {
      this.searchList.category3Id = ''
      this.searchList.category2Id = ''
      this.searchList.category1Id = ''
    },
    // 删除面包屑
    removeCategoryName() {
      this.searchList.categoryName = ''
      // 清空id
      this.getEmpty()
      // 重新发起请求
      this.getSearchData()
      // 跳转路由，为的是清空参数。
      if (this.$route.params) {
        this.$router.push({
          name: 'search',
          params: { keyword: this.$route.params.keyword }
        })
      }
    },
    removeKeyword() {
      this.searchList.keyword = ''
      this.getSearchData()
      // 通知header组件清空文本框里面的信息
      this.$bus.$emit('clear')
      this.$router.push({
        name: 'search',
        query: this.$route.query
      })
    },
    // 删除标签
    removeTrademark() {
      this.searchList.trademark = ''
      this.getSearchData()
    },
    // 删除品牌属性的面包屑
    removeAttr(index) {
      // 删除数组当中的属性
      this.searchList.props.splice(index, 1)
      this.getSearchData()
    },
    // 自定义事件的回调函数
    trademarkInfo(trademark) {
      this.searchList.trademark = `${trademark.tmId}:${trademark.tmName}`
      // 重新发起请求
      this.getSearchData()
    },
    attrInfo(attrs, attrValue) {
      //  ["属性ID:属性值:属性名"]
      console.log(attrs, attrValue)
      const props = `${attrs.attrId}:${attrValue}:${attrs.attrName}`
      // 对数组进行去重
      if (this.searchList.props.indexOf(props) === -1) {
        this.searchList.props.push(props)
      }
      this.getSearchData()
    },
    // 处理排序的函数
    changeOrder(flag) {
      // 传入的形参是表明是否是综合还是价格
      let originFlag = this.searchList.order.split(':')[0]
      let originSort = this.searchList.order.split(':')[1]
      let newOrder = ''
      if (flag === originFlag) {
        newOrder = `${originFlag}:${originSort === 'desc' ? 'asc' : 'desc'}`
      } else {
        // 点击的不是同一个按钮
        newOrder = `${flag}:${'desc'}`
      }
      this.searchList.order = newOrder
      //#region
      /* if (flag === '1') {
        if (this.searchList.order === '1:desc') {
          this.searchList.order = '1:asc'
        } else {
          this.searchList.order = '1:desc'
        }
      } else {
        if (this.searchList.order === '2:desc') {
          this.searchList.order = '2:asc'
        } else {
          this.searchList.order = '2:desc'
        }
      } */
      //#endregion
    },
    // 自定义事件的回调---切换页码
    getPageNo(pageNo) {
      this.searchList.pageNo = pageNo
      // 再次发请求
      this.getSearchData()
    }
  },
  computed: {
    ...mapGetters(['goodsList', 'attrsList', 'trademarkList']),
    isOne() {
      return this.searchList.order.indexOf('1') != -1
    },
    isTwo() {
      return this.searchList.order.indexOf('2') != -1
    },
    isAsc() {
      return this.searchList.order.indexOf('asc') != -1
    },
    isDesc() {
      return this.searchList.order.indexOf('desc') != -1
    },
    ...mapState({
      total: (state) => state.search.searchList.total
    })
  },
  // 因为mounted只是组件挂载完毕执行一次,再次点击查询按钮或者传递参数就不会再发请求了，这样我们需要监听路由的变化,当路由里面的参数发生变化时，再次发起请求
  watch: {
    $route(newValue, oldValue) {
      // 重新队数据进行整理
      Object.assign(this.searchList, this.$route.query, this.$route.params)
      console.log(this.searchList)
      // 再次发起请求
      this.getSearchData()
      // 清空上一次传入的 1、2、3级列表的id
      this.getEmpty()
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
