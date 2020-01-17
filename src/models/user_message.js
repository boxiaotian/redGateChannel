import HTTP from '@/utils/api'

export default class UserMessageModel extends HTTP {

  userInfo(params) {
    return this.request({
      url: 'Apipersonal/user',
      data: { yzdl: "yzdl", ...params }
    });
  }

}
