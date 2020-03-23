<template>
  <div id="userCenter">
    <!-- 导航栏 -->
    <van-nav-bar
      title="用户中心"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="logout">
      <button @click="Logout">退出登录</button>
    </div>
  </div>
</template>

<script>
import { getLogout } from "./../../../service/api/index";
import { mapMutations } from "vuex";
import { Toast } from "vant";
export default {
  methods: {
    //退出登录
    ...mapMutations(["RESET_USER_INFO","CLEAR_CART"]),
    async Logout() {
      let result = await getLogout();
      if (result.success_code === 200) {
        //清除本地数据
        this.RESET_USER_INFO();
        //清除购物车数据
        this.CLEAR_CART();
        Toast({
          message: "退出登录成功",
          duration: 500
        });
      }
    }
  }
};
</script>

<style>
#userCenter {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  background-color: #f5f5f5;
}
.logout {
  margin-top: 4rem;
  width: 100%;
  height: 3rem;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logout button {
  background-color: transparent;
}
</style>