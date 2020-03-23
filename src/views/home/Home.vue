<template>
  <div id="home">
    <div class="loading" v-if="!showloading">
      <Header />
      <Swiper :swiper_List="swiper_List" />
    </div>
    <van-loading
      v-else
      type="spinner"
      color="#75a342"
      style="position:absolute;left:50%;top:40%;transform:translate(-50%)"
    >小撩正在拼命加载中</van-loading>
    <Nav :nav_List="nav_List" />
    <flashSale :flashsale_product_List="flashsale_product_List" />
    <youLike :youLike_product_List="youLike_product_List" />
    <markPage v-if="showMarkpage" :scrollToTop="scrollToTop" />
  </div>
</template>
<script>
//1.引入网络接口方法
import { getHomeData } from "./../../service/api/index";
//2.引入Header组件
import Header from "./components/header/Header";
//2.1.引用swiper组件
import Swiper from "./components/swiper/Swiper";
//2.2.引入nav导航组件
import Nav from "./components/nav/Nav";
//2.3.引入限时抢购
import flashSale from "./components/nav/falshsale/flashSale";
//2.4.引入猜你喜欢
import youLike from "./components/youlike/youLike";
//2.5.引入返回顶部图标
import markPage from "./components/markpage/markPage";

//3引入global插件
import { showBack, animate } from "@/config/global.js";

//4引入全局过滤器插件
import "@/config/filters";

//5.引入pubsub插件
import PubSub from "pubsub-js";
import { Toast } from "vant";

//6.引入路由
import { mapMutations, mapState } from "vuex";
import { addGoodsToCart } from "./../../service/api/index";
import { getGoodsCart } from "./../../service/api/index";
export default {
  name: "Home",
  data() {
    return {
      swiper_List: [],
      showloading: true,
      nav_List: [],
      flashsale_product_List: [],
      youLike_product_List: [],
      //是否显示markpage组件
      showMarkpage: false
    };
  },
  created() {
    //2.请求网络数据

    this.reqData();
    // getHomeData().then(resp=>{
    //     if(resp.success){
    //         this.swiper_List= resp.data.list[0].icon_list;
    //         this.nav_List= resp.data.list[2].icon_list;
    //         this.flashsale_product_List= resp.data.list[3].product_list
    //         this.youLike_product_List= resp.data.list[12].product_list
    //     }

    //     //监听loading动画
    //     this.showloading=false

    //     //开始监听返回顶部
    //     showBack((stutas)=>{
    //         // console.log(stutas)
    //         this.showMarkpage=stutas
    //     })
    // }).catch(error=>{
    //     console.log(error)
    // })
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    //订阅消息(添加到购物车的信息)
    PubSub.subscribe("homeAddToCart", (msg, goods) => {
      if (msg === "homeAddToCart") {
        if (this.userInfo.token) {
          this.dealAddGoods(goods);
        } else {
          this.$router.push("/login");
        }
      }
    });
  },
  components: {
    Header,
    Swiper,
    Nav,
    flashSale,
    youLike,
    markPage
  },
  methods: {
    ...mapMutations(["ADD_GOODS"]),
    //请求数据
    async reqData() {
      let resp = await getHomeData();
      //    console.log(res)
      if (resp.success) {
        this.swiper_List = resp.data.list[0].icon_list;
        this.nav_List = resp.data.list[2].icon_list;
        this.flashsale_product_List = resp.data.list[3].product_list;
        this.youLike_product_List = resp.data.list[12].product_list;
      }

      //监听loading动画
      this.showloading = false;

      //开始监听返回顶部
      showBack(stutas => {
        // console.log(stutas)
        this.showMarkpage = stutas;
      });
    },
    //滚回顶部
    scrollToTop() {
      let docB = document.documentElement || document.body;
      animate(docB, { scrollTop: 0 }, 400, "ease-out");
    },

    //解决购物车添加商品到后端
    async dealAddGoods(goods) {
      let result = await addGoodsToCart(
        this.userInfo.token,
        goods.id,
        goods.name,
        goods.price,
        goods.small_image
      );

      if (result.success_code === 200) {
        this.ADD_GOODS({
          goodsId: goods.id,
          goodsname: goods.name,
          samllImage: goods.small_image,
          goodsPrice: goods.price
        });

        Toast({
          message: "添加购物车成功",
          duration: 800
        });
      }
      let qwe = await getGoodsCart(this.userInfo.token);
    }
  },

  beforeDestroy() {
    PubSub.unsubscribe("homeAddToCart");
  }
};
</script>
<style lang='less' scoped>
#home {
  width: 100;
  height: 300rem;
  background-color: #f5f5f5;
}
</style>