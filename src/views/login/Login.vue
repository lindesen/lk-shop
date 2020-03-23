<template>
  <div class="login-container">
    <!--登录面板内容部分-->
    <div class="login-inner">
      <!--面板头部-->
      <div class="login-header">
        <div class="login-logo">
          <img src="./images/lk_logo_sm.png" alt width="300" />
        </div>
        <!--面板标题-->
        <div class="login-header-title">
          <a href="javascript:;" :class="{current:loginMode}" @click="loginModed(true)">手机登录</a>
          <a href="javascript:;" :class="{current:!loginMode}" @click="loginModed(false)">密码登录</a>
        </div>
      </div>
      <!--面板表单部分-->
      <div class="login-content">
        <form>
          <!--手机验证码登录部分-->
          <div :class="{current:loginMode}">
            <section class="login-message">
              <input type="number" maxlength="11" placeholder="手机号" v-model="phone" />
              <button
                v-if="!countDown"
                class="get-verification"
                :class="{phone_right:phoneRight}"
                @click.prevent="getVerityCode()"
              >获取验证码</button>
              <button v-else disabled="disabled" class="get-verification">已发送({{countDown}}s)</button>
            </section>
            <section class="login-verification">
              <input type="number" maxlength="8" placeholder="验证码" v-model="code" />
            </section>
            <section class="login-hint">
              温馨提示：未注册小撩买菜的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">服务协议与隐私政策</a>
            </section>
          </div>
          <!--账号登录部分-->
          <div :class="{current:!loginMode}">
            <section>
              <section class="login-message">
                <input type="tel" maxlength="11" placeholder="用户名" v-model="user_name"/>
              </section>
              <section class="login-verification">
                <input type="password" maxlength="20" placeholder="密码" autocomplete="off"
                  v-model="pwd" v-if="pwdMode"
                />
                <input  type="text" maxlength="20" placeholder="密码" autocomplete="off" 
                  v-model="pwd" v-else
                />
                <div class="switch-show">
                  <img src="./images/hide_pwd.png" :class="{on:pwdMode}" alt width="20" @click.prevent="dealPwdMode(false)"/>
                  <img src="./images/show_pwd.png" :class="{on:!pwdMode}" alt width="20"  @click.prevent="dealPwdMode(true)"/>
                </div>
              </section>
              <section class="login-message">
                <input type="text" maxlength="4" placeholder="验证码" v-model="captcha"/>
                <img 
                class="get-verification"
                src="http://demo.itlike.com/web/xlmc/api/captcha"
                alt="captcha"
                ref="captcha"
                @click.prevent="getCaptcha"
                 />
              </section>
            </section>
          </div>
          <button class="login-submit" @click.prevent="login">登录</button>
        </form>
        <button class="login-back" @click.prevent="$router.back()">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getPhoneCode, phoneCodeLogin,pwdLogin } from "./../../service/api/index";
import { Toast } from "vant";
import {mapMutations, mapActions} from 'vuex'
export default {
  data() {
    return {
      loginMode: true, //是否显示
      phone: null, //手机号码
      countDown: 0, //倒计时显示
      timer: null, //计时器
      code: null, //验证码
      userInfo: null, //用户信息

      user_name:null , //用户名
      pwd:null ,   //密码
      pwdMode:true,  //密码是否明文
      captcha:null,  //图形验证码

    };
  },
  computed: {
    // 验证手机号码是否正确

    phoneRight() {
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone);
    }
  },

  methods: {
     ...mapActions(['syncUserInfo']),
    //登录切换类名
    loginModed(flag) {
      this.loginMode = flag;
    },
    //验证码获取
    async getVerityCode() {
      if (this.phoneRight) {
        this.countDown = 5;
        this.timer = setInterval(() => {
          this.countDown--;
          if (this.countDown === 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      }
      //获取短信验证码
      let result = await getPhoneCode(this.phone);
      console.log(result);
    },
    //登录
    async login() {
      //判断登录方式
      if (this.loginMode) {
        //手机验证码登录
        if (!this.phone.trim()) {
          //没有输入手机号码
          Toast({
            message: "请输入手机号码",
            duration: 500
          });
          return;
        } else if (!this.phoneRight) {
          //手机号码输入不正确
          Toast({
            message: "请输入正确的手机号码",
            duration: 500
          });
          return;
        }

        if (!this.code.trim()) {
          //没有输入手机号码
          Toast({
            message: "请输入验证码",
            duration: 500
          });
          return;
        } else if (!/^\d{6}$/gi.test(this.code)) {
          //手机号码输入不正确
          Toast({
            message: "请输入正确的验证码",
            duration: 500
          });
          return;
        }

        let result = await phoneCodeLogin(this.phone, this.code);
        console.log(result);
        if(result.success_code===200){
          this.userInfo=result.data
          this.syncUserInfo(this.userInfo)
          this.$router.back()
        }else{  
          //手机号码输入不正确
          Toast({
            message: "登录失败，手机或者验证码不正确",
            duration: 500
          });
        }
      } else {
        //手机密码登录
        if (!this.user_name) {
          //没有输入用户名
          Toast({
            message: "请输入用户名",
            duration: 500
          });
          return;
        } else if (!this.pwd) {
          //手机号码输入不正确
          Toast({
            message: "请输入密码",
            duration: 500
          });
          return;
        } else if (!this.captcha) {
          //手机号码输入不正确
          Toast({
            message: "请输入验证码",
            duration: 500
          });
          return;
        }

        //如果都验证成功，就向服务器发送请求
        let result = await pwdLogin()
        console.log(result)
      }

    
    },

    //处理用户密码登录明文显示
    dealPwdMode(flag){
      this.pwdMode = flag
    },
    //处理验证码变化
    getCaptcha(){
      let captchaEle = this.$refs.captcha
      this.$set(captchaEle,'src','http://demo.itlike.com/web/xlmc/api/captcha?time=' + new Date())
    }
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  background: #fff;
}

.login-container .login-inner {
  padding-top: 60px;
  width: 80%;
  margin: 0 auto;
}

.login-container .login-inner .login-header .login-logo {
  font-size: 40px;
  font-weight: bold;
  color: #75a342;
  text-align: center;
}

.login-container .login-inner .login-header .login-header-title {
  padding-top: 40px;
  padding-bottom: 10px;
  text-align: center;
}

.login-container .login-inner .login-header .login-header-title > a {
  color: #333;
  font-size: 14px;
  padding-bottom: 4px;
  text-decoration: none;
}

.login-container
  .login-inner
  .login-header
  .login-header-title
  > a:first-child {
  margin-right: 40px;
}

.login-container .login-inner .login-header .login-header-title > a.current {
  color: #75a342;
  font-weight: 700;
  border-bottom: 2px solid #75a342;
}

.login-container .login-inner .login-content > form > div {
  display: none;
}

.login-container .login-inner .login-content > form > div.current {
  display: block;
}

.login-container .login-inner .login-content > form > div input {
  width: 100%;
  height: 100%;
  padding-left: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: 0;
  font: 400 14px Arial;
}

.login-container .login-inner .login-content > form > div input:focus {
  border: 1px solid #75a342;
}

.login-container .login-inner .login-content > form > div .login-message {
  position: relative;
  margin-top: 16px;
  height: 48px;
  font-size: 14px;
  background: #fff;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-message
  .get-verification {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: 0;
  color: #ccc;
  font-size: 14px;
  background: transparent;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-message
  .get-verification.phone_right {
  color: #75a342;
}

.login-container .login-inner .login-content > form > div .login-verification {
  position: relative;
  margin-top: 16px;
  height: 48px;
  font-size: 14px;
  background: #fff;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-verification
  .switch-show {
  position: absolute;
  right: 10px;
  top: 12px;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-verification
  .switch-show
  img {
  display: none;
}

.login-container
  .login-inner
  .login-content
  > form
  > div
  .login-verification
  .switch-show
  img.on {
  display: block;
}

.login-container .login-inner .login-content > form > div .login-hint {
  margin-top: 12px;
  color: #999;
  font-size: 12px;
  line-height: 20px;
}

.login-container .login-inner .login-content > form > div .login-hint > a {
  color: #75a342;
}

.login-container .login-inner .login-content > form .login-submit {
  display: block;
  width: 100%;
  height: 42px;
  margin-top: 30px;
  border-radius: 4px;
  background: #75a342;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 42px;
  border: 0;
}

.login-container .login-inner .login-content .login-back {
  display: block;
  width: 100%;
  height: 42px;
  margin-top: 15px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid #75a342;
  color: #75a342;
  text-align: center;
  font-size: 16px;
  line-height: 42px;
}
</style>