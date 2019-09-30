import HTTP from '@/utils/api'

export default class OrderModel extends HTTP {
  // 礼包订单
  orderGiftBagc(params) {
    return this.request({
      url: "Apipersonal/orderGiftBagc",
      data: { yzdl: "yzdl", ...params }
    })
  }

  // 礼包订单支付
  orderGiftBagcPay(params) {
    return this.request({
      url: "Apipersonal/orderGiftBagcPay",
      data: { yzdl: "yzdl", ...params }
    })
  }
}