import HTTP from '@/utils/api'

export default class OrderModel extends HTTP {
  // 自营订单
  orderHm(params) {
    return this.request({
      url: "Apipersonal/orderHm",
      data: { yzdl: "yzdl", ...params }
    })
  }
  // 自营订单支付
  orderHmPay(params) {
    return this.request({
      url: "Apipersonal/orderHmPay",
      data: { yzdl: "yzdl", ...params }
    })
  }

  // 团购订单
  orderDoctor(params) {
    return this.request({
      url: "Apipersonal/orderDoctor",
      data: { yzdl: "yzdl", ...params }
    })
  }

  // 团购订单支付
  orderDoctorPay(params) {
    return this.request({
      url: "Apipersonal/orderDoctorPay",
      data: { yzdl: "yzdl", type: 4, ...params }
    })
  }
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