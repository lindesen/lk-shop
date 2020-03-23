<template>
  <div id="OrderDetail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="商品清单"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-cell-group>
      <van-cell title="商品数量" :value="`共${seletedLength}件`" style="margin-top:3rem"></van-cell>
      <van-card
      v-for="goods in seletedShowCart"
      :key="goods.id"
        :num="goods.num"
        :price="goods.price"
        :title="goods.name"
        :thumb="goods.small_image"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["shopCart"]),
    //选择√的商品
    seletedShowCart() {
      let shopCart = [];
      Object.values(this.shopCart).forEach((goods, index) => {
        if (goods.checked) {
          shopCart.push(goods);
        }
      });
      return shopCart;
    },
    //商品的总数
    seletedLength() {
      let shopNum = null;
      Object.values(this.shopCart).forEach((goods, index) => {
        if (goods.checked) {
          shopNum+=goods.num;
        }
      });
      return shopNum;
    }
  }
};
</script>

<style>
#OrderDetail {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
#OrderDetail {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
}
</style>