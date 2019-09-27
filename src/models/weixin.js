import HTTP from '@/utils/api'

export default class WeiXinModel extends HTTP {
  // 获取公众号APPID
  getConfig() {
    return this.request({
      url: 'apiwx/getConfig'
    })
  }

  // 查询微信用户信息
  getMemberInfo(code) {
    return this.request({
      url: 'Apiwx/getMemberInfo',
      data: { code }
    })
  }

  // 查询APP用户信息
  selectUser(uid) {
    return this.request({
      url: 'Apiwx/selectUser',
      data: { uid }
    })
  }

  // H5登录
  codelogin(params) {
    return this.request({
      url: 'Apiwx/codelogin',
      data: params
    })
  }

  // H5注册
  register(params) {
    return this.request({
      url: 'Apiwx/register',
      data: params
    })
  }

  // 发送验证码
  sendCode(mobile) {
    return this.request({
      url: 'Apiwx/sendCode',
      data: { mobile }
    })
  }
}