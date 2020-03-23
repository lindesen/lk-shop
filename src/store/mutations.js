import {
    ADD_GOODS,
    INIT_SHOP_CAR,
    REDUCE_CART,
    SELECTED_SINGER_GOODS,
    SELECTED_ALL_GOODS,
    CLEAR_CART,
    USER_INFO,
    INIT_USER_INFO,
    RESET_USER_INFO
} from './mutations-type'
import '@/config/global'
import { setStore, getStore, removeStore } from '../config/global';
import Vue from 'vue'

export default {
    //1往购物车中添加商品
    [ADD_GOODS](state, { goodsId, goodsname, samllImage, goodsPrice }) {

        let shopCart = state.shopCart;
        //1.1判断是否又该商品
        if (shopCart[goodsId]) {
            shopCart[goodsId]['num']++;
        } else {
            shopCart[goodsId] = {
                'num': 1,
                'id': goodsId,
                'name': goodsname,
                'small_image': samllImage,
                'price': goodsPrice,
                'checked': true
            }
        }

        //1.2产生新对象
        state.shopCart = {...shopCart }
            //1.3存储本地对象
        setStore('shopCart', state.shopCart);
    },
    //页面初始化，获取购物车本地
    [INIT_SHOP_CAR](state) {
        let initCar = getStore('shopCart');
        if (initCar) {
            state.shopCart = JSON.parse(initCar)
        }
    },

    //移除商品
    [REDUCE_CART](state, { goodsId }) {
        let shopCart = state.shopCart
        let goods = shopCart[goodsId];
        if (goods) { //找到该商品
            if (goods['num'] > 0) {
                goods['num']--;
                //判断是否只有0个
                if (goods['num'] === 0) {
                    delete shopCart[goodsId]
                }
            }
        } else {
            goods = null
        }
        //同步数据
        state.shopCart = {...shopCart }
        setStore('shopCart', state.shopCart);

    },

    //商品是否选中
    [SELECTED_SINGER_GOODS](state, { goodsId }) {
        let shopCart = state.shopCart
        let goods = shopCart[goodsId];
        if (goods) {
            if (goods.checked) {
                goods.checked = !goods.checked
            } else {
                //往属性添加方法
                Vue.set(goods, 'checked', true)
            }

            //同步数据
            state.shopCart = {...shopCart }
            setStore('shopCart', state.shopCart);

        }
    },

    //所有商品是否选中
    [SELECTED_ALL_GOODS](state, { isSelected }) {
        let shopCart = state.shopCart
        Object.values(shopCart).forEach((goods) => {
            if (goods.checked) {
                goods.checked = !isSelected
            } else {
                Vue.set(goods, 'checked', !isSelected)
            }
        })
        state.shopCart = {...shopCart }
    },

    //清空购物车商品
    [CLEAR_CART](state) {
        state.shopCart = null;
        state.shopCart = {...state.shopCart }
        setStore('shopCart', state.shopCart)
    },

    //保存用户个人信息
    [USER_INFO](state, { userInfo }) {
        state.userInfo = userInfo;
        setStore('userInfo', state.userInfo)
    },

    //初始化用户个人信息
    [INIT_USER_INFO](state) {
        //获取用户信息
        let userInfo = getStore('userInfo')
            //判断用户是否存在
        if (userInfo) {
            state.userInfo = JSON.parse('userInfo')
        }
    },

    //重置用户信息
    [RESET_USER_INFO](state) {
        console.log('-------------------1--------')
        state.userInfo = {};
        removeStore('userInfo');
    }
}