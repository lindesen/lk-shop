import Vue from 'vue'
import Router from 'vue-router'
//1级组件
import Dashboard from './../views/dashboard/Dashboard'
// import Home from '@/views/home/Home.vue'
// import Cart from '@/views/cart/Cart.vue'
// import Categroy from '@/views/categroy/Categroy.vue'
// import Mine from '@/views/mine/Mine.vue'
const Home = () =>
    import ('./../views/home/Home')
const Cart = () =>
    import ('./../views/cart/Cart')
const Categroy = () =>
    import ('./../views/categroy/Categroy')

//用户登录
const Mine = () =>
    import ('./../views/mine/Mine')
    //用户中心
const UserCenter = () =>
    import ('./../views/mine/children/UserCenter')
    //订单详情
const MineOrder = () =>
    import ('./../views/mine/children/MineOrder')

const MineOrderItem = () =>
    import ('./../views/mine/children/components/MineOrderItem')



//引入添加联系人组件
import Order from './../views/order/Order'
const myAddress = () =>
    import ('./../views/order/children/myAddress');
const OrderDetail = () =>
    import ('./../views/order/children/OrderDetail')
const AddAddress = () =>
    import ('./../views/order/children//children/addAddress')
const EditAddress = () =>
    import ('./../views/order/children//children/editAddress')

//引入登录组件
import Login from './../views/login/Login'
Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard,
            children: [{
                    path: '/dashboard',
                    redirect: '/dashboard/home'
                }, {
                    path: 'home',
                    name: 'home',
                    component: Home,
                    meta: {
                        keepAlive: true
                    }
                },

                {
                    path: 'categroy',
                    name: 'categroy',
                    component: Categroy,
                    meta: {
                        keepAlive: true
                    }
                }, {
                    path: 'cart',
                    name: 'cart',
                    component: Cart
                },
                {
                    path: 'mine',
                    name: 'mine',
                    component: Mine,
                    children: [{
                        path: 'userCenter',
                        name: 'userCenter',
                        component: UserCenter
                    }, {
                        path: 'mineOrder',
                        name: 'mineOrder',
                        component: MineOrder,
                        children: [{
                            path: 'mineOrderItem',
                            name: 'mineOrderItem',
                            component: MineOrderItem
                        }]
                    }]
                }
            ]
        }, {
            path: '/confimOrder',
            name: 'order',
            component: Order,
            children: [{
                path: 'myAddress',
                name: 'myAddress',
                component: myAddress,
                children: [{
                        path: 'addAddress',
                        name: 'addAddress',
                        component: AddAddress,
                    },
                    {
                        path: 'editAddress',
                        name: 'editAddress',
                        component: EditAddress,
                    }
                ]
            }, {
                path: 'orderDetail',
                name: 'orderDetail',
                component: OrderDetail
            }]
        }, {
            path: '/login',
            name: 'login',
            component: Login
        }
    ]
})