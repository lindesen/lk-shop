<template>
  <div id="categroy">
    <!-- 头部 -->
    <Header />
    <!-- 内容 -->
    <div class="listWrapper" v-if="!showloading">
      <!-- 左边 -->
      <div class="leftWrapper">
        <ul class="wrapper">
          <li
            class="categoryItem"
            v-for="(cate,index) in categories"
            :key="cate.id"
            :class="{selected:currentIndex==index}"
            @click="clickLeft(index)"
            ref="menuList"
          >
            <span class="textWrapper">{{cate.name}}</span>
          </li>
        </ul>
      </div>
      <!-- 右边 -->
      <ContentView :categoriesDetail="categoriesDetail" />
    </div>
    <van-loading
      v-else
      type="spinner"
      color="#75a342"
      style="position:absolute;left:50%;top:40%;transform:translate(-50%)"
    >小撩正在拼命加载中</van-loading>
  </div>
</template>
<script>
//1.引入组件
import Header from "./components/header/header";
import ContentView from "./components/right/ContentView";
//2.引入滚动插件
import Bscroll from "better-scroll";

//3.引入网络请求方法
import {
  getCategories,
  getCategoriesDetail,
  addGoodsToCart
} from "@/service/api/index";
//4引入全局过滤器插件
import "@/config/filters";
//5.引入pubsub插件
import PubSub from "pubsub-js";
import { Toast } from "vant";
//6.引入路由
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      //动画加载
      showloading: true,
      //接收左边数据
      categories: [],
      //右边数据
      categoriesDetail: [],
      //定义一个索引变量
      currentIndex: ""
    };
  },
  name: "Categroy",
  created() {
    this.initData();
  },
  computed: {
    ...mapState(["userInfo"])
  },
  components: {
    Header,
    ContentView
  },
  mounted() {
    //订阅消息(添加到购物车的信息)
    PubSub.subscribe("categoryAddToCart", (msg, goods) => {
      console.log(goods)
      if (this.userInfo.token) {
        this.dealAddToCart(goods);
      } else {
        this.$router.push("/login");
      }
    });
  },
  methods: {
    ...mapMutations(["ADD_GOODS"]),
    //获取数据渲染视图和界面
    async initData() {
      //1.获取左边信息
      let leftRes = await getCategories();
      if (leftRes.success) {
        this.categories = leftRes.data.cate;
      }
      // console.log(this.categories)
      //2.获取右边信息
      let rightRes = await getCategoriesDetail("/lk001");
      if (rightRes.success) {
        this.categoriesDetail = rightRes.data.cate;
      }
      //3.隐藏loading动画
      this.showloading = false;

      //4.初始化滚动框架
      this.$nextTick(() => {
        this.leftScroll = new Bscroll(".leftWrapper", {
          mouseWheel: true
        });
      });
    },
    //2.处理左边内容点击
    async clickLeft(index) {
      //2.1让索引相等
      this.currentIndex = index;
      //2.2定义变量
      let menuLists = this.$refs.menuList;
      let el = menuLists[index];

      //2.3滚动到指定的class类名
      this.leftScroll.scrollToElement(el, 300);

      //2.4接收右边数据
      let rightRes = await getCategoriesDetail(`/lk00${index + 1}`);
      if (rightRes.success) {
        this.categoriesDetail = rightRes.data.cate;
      }
    },
    async dealAddToCart(goods) {
      let result = await addGoodsToCart(
        this.userInfo.token, goods.id, goods.name, goods.price, goods.small_image
      );
      console.log(result);
      if (result.success_code === 200) {
        this.ADD_GOODS({
          goodsId: goods.id,
          goodsname: goods.name,
          samllImage: goods.small_image,
          goodsPrice: goods.price
        });
        Toast({
                message:"添加购物车成功",
                duration:800
        })
      }
    }
  },
  beforeDestroy() {
    PubSub.unsubscribe("categoryAddToCart");
  }
};
</script>
<style lang='less' scoped>
#categroy {
  width: 100;
  height: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
}
.listWrapper {
  display: flex;
  position: absolute;
  top: 2.75rem;
  bottom: 3rem;
  // background-color: red;
  overflow: hidden;
  width: 100%;
}
.leftWrapper {
  background-color: #f4f4f4;
  width: 5.3125rem;
  flex: 0 0 5.3125rem;
}

.categoryItem {
  padding: 0.75rem 0;
  border-bottom: solid 1px #e8e9e8;
  position: relative;
}

.categoryItem .textWrapper {
  line-height: 1.25rem;
  border-left: solid 0.1875rem transparent;
  padding: 0.3125rem 0.6875rem;
  font-size: 0.8125rem;
  color: #666666;
}

.categoryItem.selected {
  background: #fff;
}

.categoryItem.selected .textWrapper {
  border-left-color: #3cb963;
  font-weight: bold;
  font-size: 0.875rem;
  color: #333333;
}

@media (min-width: 960px) {
  .wrapper {
    border-right: 1px solid #e8e9e8;
  }

  .wrapper .categoryItem {
    background: #fff;
  }
}
</style>