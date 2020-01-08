import HTTP from '@/utils/api'

export default class NoteModel extends HTTP {

  noteList(params) {
    return this.request({
      url: 'Apicouponcard/index',
      data: { yzdl: "yzdl", ...params }
    });
  }
  noteDetails(params) {
    return this.request({
      url: 'Apicouponcard/cardDetails',
      data: { yzdl: "yzdl", time: new Date().getTime(), ...params }
    });
  }
  hsptlList(params){
    return this.request({
      url: 'Apicouponcard/getDoctor',
      data: { yzdl: "yzdl", ...params }
    });
  }
   // 卡券列表 - 提交订单
   cardPay(params) {
    return this.request({
      url: "Apicouponcard/cardPay",
      data: { yzdl: "yzdl", source_type: 2,pay_type: 4, ...params }
    });
  }
}
