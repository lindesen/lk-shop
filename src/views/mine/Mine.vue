<template>
<!--  " -->
  <div id="mine" v-if="userInfo.token">
    <van-nav-bar title="我的" :border="false" />

    <van-cell-group>
      <van-cell :border="false" :center="true" @click="$router.push('/dashboard/mine/userCenter')">
        <!-- 使用 title 插槽来自定义标题 -->
        <template slot="title">
          <div class="personMsg">
            <img :src="userInfo.icon_url" alt />
            <div class="personInfo">
              <span>{{userInfo.real_name}}</span>
              <span>{{userInfo.phone}}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell icon="description" title="我的订单" value="查看全部订单" is-link @click="$router.push('/dashboard/mine/mineOrder')"/>

    <router-link :to="{path:'/dashboard/mine/mineOrder'}" tag="div">
      <van-grid :column-num="4">
      <van-grid-item
        v-for="(order,index) in orderData"
        :key="index"
        :icon="order.icon"
        :text="order.text"
      />
    </van-grid>
    </router-link>

     <van-cell-group style="margin-top:0.6rem">
    <van-cell icon="after-sale" title="我的优惠券" value="1张" is-link />
    <van-cell icon="records" title="我的收货地址"  is-link />
    </van-cell-group>

    <van-cell-group style="margin-top:0.6rem">
    <van-cell icon="phone-o" title="联系客服" value="客服时间 07:00-22:00" is-link />
    <van-cell icon="comment-o" title="意见反馈"  is-link />
    </van-cell-group>

    <van-cell style="margin-top:0.6rem" icon="smile-o" title="小撩买菜" value="下载APP体验更佳" is-link />

    <!-- 用户退出 -->
<transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
  <SelectLogin v-else />
</template>
<script>
import {mapState} from 'vuex'
import SelectLogin from './../login/SelectLogin'
export default {
  name: "Mine",
  data() {
    return {
      orderData: [
        {
          icon: "credit-pay",
          text: "待支付"
        },
        {
          icon: "paid",
          text: "待收货"
        },
        {
          icon: "chat-o",
          text: "待评价"
        },
        {
          icon: "cash-back-record",
          text: "售后/退款"
        }
      ]
    };
  },
  computed:{
      ...mapState(['userInfo'])
  },
  components:{
      SelectLogin
  }
  
};
</script>
<style lang='less' scoped>
#mine {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.van-nav-bar {
  background-color: #3bba3b;
}

.van-nav-bar__title {
  color: #fff;
  font-size: 1rem;
}

.personMsg {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.personMsg > img {
  width: 4rem;
  height: 4rem;
  border-radius: 2rem;
  border: 0.12rem solid #fff;
}

.personInfo {
  display: flex;
  flex-direction: column;
  margin-left: 0.8rem;
}

.van-cell__left-icon {
  color: #008c8c;
  font-size: 1.2rem;
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