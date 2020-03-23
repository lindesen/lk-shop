<template>
  <div id="myAddress">
    <!-- 导航栏 -->
    <van-nav-bar
      title="我的地址"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认"
      @select="selectAddress"
      @add="onAdd"
      @edit="onEdit"
      style="margin-top:3rem"
    />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { Toast } from "vant";
import { mapState } from "vuex";
import { getUserAddress } from "./../../../service/api/index";
import PubSub from "pubsub-js";
export default {
  data() {
    return {
      chosenAddressId: "1",
      list: []
    };
  },
  mounted() {
    this.initUserAddress();
    //订阅信息
    PubSub.subscribe('addAddressSuccess', (msg) => {
      if (msg === 'addAddressSuccess') {
        this.initUserAddress();
      }
    });
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
    onAdd() {
      // Toast("新增地址");
      this.$router.push("/confimOrder/myAddress/addAddress");
    },
    onEdit(item, index) {
      // Toast("编辑地址:" + index);
      // console.log(item)
      this.$router.push("/confimOrder/myAddress/editAddress?Address_id="+item.address_id);
    },

    //获取用户当前地址
    async initUserAddress() {
      if (this.userInfo.token) {
        //用户已经登录了
        let result = await getUserAddress(this.userInfo.token);
        // console.log(result);
        if (result.success_code === 200) {
          this.list = []
          let address = result.data;
          address.forEach((value, index) => {
            let addressObj = {
              id: index + 1,
              name: value.address_name,
              tel: value.address_phone,
              address: value.address_area + "  " + value.address_area_detail,
              address_id: value._id,
              user_id: value.user_id
            };
            this.list.push(addressObj);
          });
        }
      } else {
        Toast({
          message: "登录已过期！请重新登录",
          duration: 400
        });
      }
    },
    selectAddress(item){
      if(item){
      PubSub.publish('selectAddress',item)
      this.$router.back();
      }
    }
  },
  beforeDestroy() {
    PubSub.unsubscribe('addAddressSuccess');
  }
};
</script>
<style scoped>
#myAddress {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
#myAddress {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
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