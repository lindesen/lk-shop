import { USER_INFO } from './mutations-type'
import { getStore } from './../config/global'
import { getPass } from './../service/api/index'
export default {
    // 1. 同步用户信息
    syncUserInfo({ commit }, userInfo) {
        commit(USER_INFO, { userInfo })
    },

    //2.自动登录
    async reqUserInfo({ commit }) {
        // 2.1 从本地获取数据
        let userInfo = JSON.parse(getStore('userInfo'));
        //判断本地存储中有无
        if (userInfo) {
            commit(USER_INFO, { userInfo })
        } else {
            let resulte = await getPass()
            if (resulte.sucess_code === 200) {
                commit(USER_INFO, { userInfo })
            }
        }
    }
}