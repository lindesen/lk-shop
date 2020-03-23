<template>
  <div id="editAddress">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改地址"
      left-text="返回"
      :fixed="true"
      :border="true"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-address-edit
      :area-list="areaList"
      :address-info="address_info"
      show-postal
      show-delete
      show-set-default
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      style="margin-top:3rem"
    />
  </div>
</template>
<script>
import AreaList from './../../../../config/area'
import { Toast } from "vant";
import areaList from "./../../../../config/area";
import { mapState } from "vuex";
import { getCurrentUserAddress,changeUserAddress,delUserAddress } from "./../../../../service/api/index";
import PubSub from 'pubsub-js'
export default {
  data() {
    return {
      areaList: AreaList,
      address_info: {}
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    if (this.$route.query.Address_id) {
      if (this.userInfo.token) {
        this.getCurrentAddress(
          this.userInfo.token,
          this.$route.query.Address_id
        );
      }
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },

  async  onSave(content) {
        if(this.userInfo.token){
          //发送请求
            let result = await changeUserAddress(this.address_info.id,this.userInfo.token,content.name, content.tel, content.province+content.city+content.county, content.addressDetail, content.postalCode, content.isDefault, content.province, content.city, content.county, content.areaCode)
            //判断
            if(result.success_code === 200){
              Toast({
                message:'修改地址成功！',
                duration:400
              })
              //返回上级页面
              this.$router.back()
              //发送通知
              PubSub.publish('addAddressSuccess');
            }else{
              Toast({
                message:'修改地址失败！',
                duration:400
              })
            }
        }
    },
   async onDelete(content) {
        if(this.userInfo.token){
          let result = await delUserAddress(this.address_info.id)
          if(result.success_code === 200){
            Toast({
                message:'删除地址成功！',
                duration:400
              })
              //返回上级页面
              this.$router.back()
              //发送通知
              PubSub.publish('addAddressSuccess');
          }else{
            Toast({
                message:'删除地址失败！',
                duration:400
              })
          }
        }
    },


    async getCurrentAddress(user_id, address_id) {
      let result = await getCurrentUserAddress(user_id, address_id);
      if (result.success_code === 200) {
        this.address_info = {
          id: result.data._id,
          name: result.data.address_name,
          tel: result.data.address_phone,
          province: result.data.province,
          city: result.data.city,
          county: result.data.county,
          addressDetail: result.data.address_area_detail,
          areaCode: result.data.areaCode,
          postalCode: result.data.address_post_code,
          isDefault: result.data.address_tag
        };
      }
    }
  }
};
</script>
<style scoped>
#editAddress {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #f5f5f5;
  z-index: 9999;
}
</style>