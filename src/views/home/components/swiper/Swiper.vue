<template>
  <swiper id="swiper" :options="swiperOption" ref="mySwiper">
    <!-- slides -->
    <swiper-slide v-for="swiper in swiper_List" :key="swiper.public_id">
        <img :src="swiper.icon_url" :alt="swiper.public_name">
    </swiper-slide>
    <!-- Optional controls -->
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  props: {
    swiper_List: Array
  },
  data() {
    return {
      swiperOption: {
        notNextTick: true,
        //分页
        pagination: {
          //挂载的id
          el: ".swiper-pagination",
          type: "bullets",
          //是否可以点击
          clickable: true
        },
        //循环
        loop: true,
        //自动播放
        autoplay: {
          delay: 1500
        },
        //速度
        speed: 700,
        //事件监听
        on: {
          slideChangeTransitionEnd() {
            // console.log(this.activeIndex)
          }
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  mounted() {
    //   this.swiper.sildeTo(3,1)
  },
  components: {
    swiper,
    swiperSlide
  }
};
</script>
<style  scoped>
#swiper {
  width: 100%;
  height: 14rem;
  background-color: gold;
}

#swiper img{
    width: 100%;
    height: 100%;
}

/**
    设置穿透效果，但是不知道为啥用不了
*/
 #swiper >>> .swiper-pagination-bullet-active{
     background-color: #75a342 !important;
}
</style>