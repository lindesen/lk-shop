<template>
  <div id="MineOrder">
    <!-- 导航栏 -->
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <!-- 标签栏 -->
    <van-tabs
      v-model="activeName"
      style="margin-top:2.6rem"
      color="#008c8c"
      title-active-color="#008c8c"
      @click="dealTabOrder"
    >
      <van-tab title="全部" name="a">
        <MineOrderItem v-for="item in allOrderArr" :key="item._id" :order="item" />
      </van-tab>
      <van-tab title="待支付" name="b">
         <MineOrderItem v-for="item in allWillArr" :key="item._id" :order="item" />
      </van-tab>
      <van-tab title="待收货" name="c">
         <MineOrderItem v-for="item in allPayArr" :key="item._id" :order="item" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MineOrderItem from "./components/MineOrderItem";
import { getOrder } from "./../../../service/api/index";
import { Toast } from "vant";
export default {
  data() {
    return {
      activeName: "a",
      allOrderArr: null, //全部商品
      allWillArr: null, //待支付商品
      allPayArr: null //待收货商品
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    this.initAllPay();
  },
  methods: {
    //查询所有商品
    async initAllPay() {
      let allPayResult = await getOrder(this.userInfo.token);
      if (allPayResult.success_code === 200) {
        this.allOrderArr = allPayResult.data;
      } else {
        Toast({
          message: "订单显示失败",
          duration: 500
        });
      }
    },
    async dealTabOrder(name, title) {
      if (name === "a") {
        this.allOrderArr = await this.getOrderItem();
      } else if (name === "b") {
        this.allWillArr = await this.getOrderItem('will');
      } else if (name === "c") {
        this.allPayArr = await this.getOrderItem('pay');
      }
    },
    async getOrderItem(staute) {
      let result = await getOrder(this.userInfo.token, staute);
      if (result.success_code === 200) {
        return result.data;
      } else {
        Toast({
          message: "订单显示失败",
          duration: 500
        });
      }
    }
  },
  components: {
    MineOrderItem
  }
};
</script>

<style>
#MineOrder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120%;
  background-color: #f5f5f5;
  z-index: 11111;
}
</style>