import Vue from 'vue';
import { Tabbar, TabbarItem } from 'vant';

Vue.use(Tabbar);
Vue.use(TabbarItem);


import { Loading } from 'vant';
Vue.use(Loading);

import { Image } from 'vant';
Vue.use(Image);

import { Toast } from 'vant';
Vue.use(Toast);

//弹出框
import { Dialog } from 'vant';
Vue.use(Dialog);

// Order页面导航栏
import { NavBar } from 'vant';
Vue.use(NavBar);

// 添加联系人界面
import { ContactCard, ContactList, ContactEdit } from 'vant';
Vue.use(ContactCard);
Vue.use(ContactList);
Vue.use(ContactEdit);

//添加地址列表
import { AddressList } from 'vant';
Vue.use(AddressList);
import { Area } from 'vant';
Vue.use(Area);


//修改联系人信息
import { AddressEdit } from 'vant';
Vue.use(AddressEdit);

//单元格
import { Cell, CellGroup } from 'vant';
Vue.use(Cell);
Vue.use(CellGroup);

//提交订单
import { SubmitBar } from 'vant';
Vue.use(SubmitBar);

//添加宫格
import { Grid, GridItem } from 'vant';
Vue.use(Grid);
Vue.use(GridItem);

//底部遮罩层
import { Popup } from 'vant';
Vue.use(Popup);

//时间选择
import { DatetimePicker } from 'vant';
Vue.use(DatetimePicker);

//商品卡片
import { Card } from 'vant';
Vue.use(Card);

//标签栏
import { Tab, Tabs } from 'vant';
Vue.use(Tab);
Vue.use(Tabs);