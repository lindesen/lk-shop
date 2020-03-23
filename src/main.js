import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index'


// 1.引入fastclick
import FastClick from 'fastclick';
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

// 2.引入全局样式
import './style/common.less'


// 3.引入UI组件
import './plugins/vant'

//4.引入remjs
import './config/rem.js'

/*6. 配置二维码*/
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')