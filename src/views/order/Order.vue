<template>
  <div id="order">
    <!-- 导航栏 -->
    <van-nav-bar
      title="填写订单"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <!-- 添加联系人地址 -->
    <van-contact-card
      @click="toAddress"
      :type="addressType"
      add-text="选择收货地址。"
      :name="addressName"
      :tel="addressPhone"
      style="margin-top: 3rem"
    />

    <!-- 单元格信息 -->
    <van-cell-group style="margin-top:0.6rem">
      <van-cell title="送达时间" :value="arriveDate" @click="showDataVant" is-link />
      <router-link :to="{path:'/confimOrder/orderDetail'}">
        <van-cell :value="`共${seletedLength}件`" is-link :center="true">
          <!-- 使用 title 插槽来自定义标题 -->
          <template slot="title">
            <img
              v-for="(goods,index) in threeShowCart"
              :key="index"
              :src="goods.small_image"
              alt
              style="width:3rem"
            />
          </template>
        </van-cell>
      </router-link>
    </van-cell-group>

    <van-cell-group style="margin-top:0.6rem">
      <van-cell title="支付" value="微信" />
    </van-cell-group>

    <van-cell-group style="margin-top:0.6rem">
      <van-cell title="备注">
        <input type="text" placeholder="选填，请备注你的要求" style="text-align:right" v-model="notice" />
      </van-cell>
    </van-cell-group>

    <van-cell-group style="margin-top:0.6rem">
      <van-cell title="商品金额" :value="`￥${totalPrice}`" />
      <van-cell title="配送费" :value="`￥${disPay}`" />
    </van-cell-group>

    <van-submit-bar
      :price="totalPrice*100 + disPay *100"
      label="实付"
      button-text="提交订单"
      @submit="onSubmit"
    />

    <!-- 送达时间填写 -->

    <van-popup v-model="dataShow" round position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmData"
        @cancel="cancelData"
      />
    </van-popup>

    <!-- 二维码支付 -->
    <van-popup v-model="isPay" round position="center">
      <qriously :value="codePay"  :size='200'      />
    </van-popup>

    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { Toast } from "vant";
import PubSub from "pubsub-js";
import Moment, { duration } from "moment";
import { mapState } from "vuex";
import {
  postOrder,
  orderPaySuccess,
  getWXCode,
  queryPayStatus,
  getAllSelectedGoods,
  delAllSelectedGoods,
  delUserAddress
} from "./../../service/api/index";
export default {
  data() {
    return {
      //1.联系人
      addressType: "add", //联系人地址类型
      addressName: null, //联系人姓名
      addressPhone: null, //联系人电话
      addressId: null, //联系人iD

      //2.日期
      dataShow: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      arriveDate: "请选择送达时间",

      //备注
      notice: null,

      isPay:false, //先否显示
      codePay:null , //二维码
    };
  },
  computed: {
    ...mapState(["shopCart", "userInfo"]),
    //计算商品总件数
    getCount() {
      // return  Object.keys(this.shopCart).length
      //判断是否选中
      let selectTotal = 0;
      Object.values(this.shopCart).forEach((good, index) => {
        if (good.checked) {
          selectTotal += 1;
        }
      });
      return selectTotal;
    },
    //计算商品的总价格
    totalPrice() {
      let totalPrice = 0;
      Object.values(this.shopCart).forEach(goods => {
        if (goods.checked) {
          totalPrice += goods.num * goods.price;
        }
      });
      return totalPrice;
    },
    //显示商品前三件
    threeShowCart() {
      let shopCart = [];
      Object.values(this.shopCart).forEach((goods, index) => {
        if (goods.checked) {
          shopCart.push(goods);
        }
      });
      return shopCart.slice(0, 3);
    },
    //商品的总数
    seletedLength() {
      let shopNum = null;
      Object.values(this.shopCart).forEach((goods, index) => {
        if (goods.checked) {
          shopNum += goods.num;
        }
      });
      return shopNum;
    },

    //配送费
    disPay() {
      return this.totalPrice > 40 ? 0 : 6;
    }
  },
  mounted() {
    PubSub.subscribe("selectAddress", (msg, address) => {
      if (msg === "selectAddress") {
        this.addressType = "edit";
        this.addressName = address.name;
        this.addressPhone = address.tel;
        this.addressId = address.address_id;
      }
    });
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    onClickRight() {
      alert(1);
    },
    toAddress() {
      this.$router.push("/confimOrder/myAddress");
    },
    //提交订单
    async onSubmit() {
      //数据验证
      if (!this.addressId) {
        Toast({
          message: "请填写收货人信息",
          duration: 500
        });
        return;
      }
      if (this.arriveDate === "请选择送达时间") {
        Toast({
          message: "请填写收货日期",
          duration: 500
        });
        return;
      }

      if (!this.notice) {
        Toast({
          message: "请填写备注要求",
          duration: 500
        });
        return;
      }
      //处理相关订单
      if (this.userInfo.token) {
        //获取商品列表
        let goodsResult = await getAllSelectedGoods(this.userInfo.token);
        console.log(goodsResult);
        if (goodsResult.success_code === 200) {
          //提交订单
          let orderResult = await postOrder(
            this.userInfo.token,
            this.addressId,
            this.arriveDate,
            goodsResult,
            this.notice,
            this.totalPrice,
            this.disPay
          );
          console.log(orderResult)
          //删除在购物车的商品
          if(orderResult.success_code===200){
            let delResult = await delAllSelectedGoods(this.userInfo.token)
            console.log(delResult)
            //微信支付
            if(delResult.success_code===200){
              let urlResult = await getWXCode(orderResult.data.order_id, 1)
              console.log(urlResult)
              if(urlResult.code_url){
                this.isPay=true
                this.codePay=urlResult.code_url
                //验证扫码支付成功
                let payResult = await queryPayStatus(orderResult.data.order_id, 1)
                if(payResult.success){
                  Toast({
                    message:payResult.message,
                    duration:500
                  })
                  //通知服务器扫码成功
                  let orderPayResult = await orderPaySuccess(this.userInfo.token,orderResult.data.order_id)
                  if(orderPayResult.success_code===200){
                    this.isPay = false;
                    this.$router.replace('/dashboard/mine')
                    window.sessionStorage.setItem('tabbarActiveIndex',3)
                  }
                }
              }
            }
          }else{
          Toast({
            message:'购物车同步出现问题',
            duration:500
          })
        }
        }else{
          Toast({
            message:'获取商品失败',
            duration:500
          })
        }
      }else{
          Toast({
            message:'获取订单失败',
            duration:500
          })
        }
    },

    //日期相关方法
    showDataVant() {
      this.dataShow = true;
    },
    cancelData() {
      this.dataShow = false;
    },
    confirmData(value) {
      this.dataShow = false;
      this.arriveDate = Moment(value).format("YYYY-MM-DD hh:mm");
    }
  },
  beforeDestroy() {
    PubSub.unsubscribe("selectAddress");
  }
};
</script>
<style scoped>
#order {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>