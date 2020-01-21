import HTTP from '@/utils/api'

export default class FanstModel extends HTTP {
 //粉丝列表
  fansList(params) {
    return this.request({
      url: '/Apipersonal/fensList',
      data: { yzdl: "yzdl",  ...params }
    });
  }

  //粉丝订单
  fansOrderList(params) {
    return this.request({
      url: '/Apipersonal/fensOrderHmList',
      data: { yzdl: "yzdl",  ...params }
    });
  }

  //粉丝订单
  fansGiftOrderList(params) {
    return this.request({
      url: '/Apipersonal/fensOrderGiftBagList',
      data: { yzdl: "yzdl",  ...params }
    });
  }
   //粉丝详情
   fansUserInfo(params) {
    return this.request({
      url: '/Apipersonal/fensOrderGiftBagList',
      data: { yzdl: "yzdl",  ...params }
    });
  }

  
}
