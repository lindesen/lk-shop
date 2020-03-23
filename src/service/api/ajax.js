import axios from 'axios'

export default function ajax(url = '', params = {}, type = 'GET') {
    //1. 变量
    let promise;

    //2. 返回promise对象
    return new Promise((resolve, reject) => {
        //2.1  判断请求的类型
        if (type.toUpperCase() === 'GET') { //get请求
            let paramsStr = ''
            Object.keys(params).forEach(key => {
                    paramsStr += key + '=' + params[key] + '&'
                })
                /*2.2 过滤最后的&*/
                /*if(paramsStr){
                    paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf('&'))
                }*/
                /*2.3 拼接完整的路径*/
                /*url += '?' + paramsStr*/
                /*2.4 发起get请求*/
            if (paramsStr) {
                paramsStr = paramsStr.substr(0, paramsStr.lastIndexOf('&'));
                // 2.5 拼接完整路径
                if (url.indexOf('47.98.157.152') === -1) {
                    url += '?' + paramsStr + '&itlike=' + randomCode(20);
                } else {
                    url += '?' + paramsStr;
                }
            } else {
                if (url.indexOf('47.98.157.152') === -1) {
                    url += '?itlike=' + randomCode(20)
                }
            }
            promise = axios.get(url)
        } else if (type.toUpperCase() === 'POST') { //post请求
            /*2.5 发起post请求*/
            promise = axios.post(url, params);
        }
        /*2.6 处理结果并返回*/
        promise.then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

function randomCode(length) {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = "";
    for (let i = 0; i < length; i++) {
        let index = Math.ceil(Math.random() * 9);
        result += chars[index];
    }
    return result;
}