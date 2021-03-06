import Taro from '@tarojs/taro'
import { HTTP_STATUS } from '@/constants/status'
import { formal_domain } from '@/constants/counter'

export default class HTTP {
  request({
    url,
    data = {},
    method = 'POST'
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }

  _request(url, resolve, reject, data = {}, method = 'POST') {
    Taro.showLoading({
      title: '加载中...',
      icon: 'loading',
    })
    console.log(url+"====",JSON.stringify(data));
    Taro.request({
      url: formal_domain + url,
      data: JSON.stringify(data),
      method: method,
      header: {
        'Accept': 'application/json',
        'content-type': 'application/json'
      },
      success: (result) => {
        console.log(url,"result",result)
        Taro.hideLoading()
        if (result.statusCode === HTTP_STATUS.NOT_FOUND) {
          Taro.showToast({
            title: '请求资源不存在',
            icon: 'none'
          })
        } else if (result.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          Taro.showToast({
            title: '服务端出现了问题',
            icon: 'none'
          })
        } else if (result.statusCode === HTTP_STATUS.FORBIDDEN) {
          Taro.showToast({
            title: '没有权限访问',
            icon: 'none'
          })
        } else if (result.statusCode === HTTP_STATUS.SUCCESS) {
          let res = result.data
          if (res.code == 1) {
            //收益接口格式无list字段，此处做兼容处理
            return res.list?resolve(res.list):resolve(res)
          } else if (url == 'Apiwx/getMemberInfo') {
            if (res.code) return resolve(res.list)
          } else if (res.code == 101 || res.code == 103) {
            Taro.showToast({
              title: '请先登录',
              icon: 'none',
              success: () => {
                setTimeout(() => {
                  Taro.redirectTo({ url: "/pages/login/index" })
                }, 1000);
              }
            })
          } else if (res.code == 206) {
            Taro.showToast({
              title: '没有绑定微信',
              icon: 'none'
            })
          } else {
            Taro.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }
      },
      fail: (e) => { reject(e) },
      complete: () => { }
    })
  }
}
