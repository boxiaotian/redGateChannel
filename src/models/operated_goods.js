import HTTP from '@/utils/api'

export default class OperatedModel extends HTTP {
  // 自营商品列表
  hmGoods(page = 0) {
    return this.request({
      url: 'Apihmselected/hmGoods',
      data: { source_mode: 1, yzdl: "yzdl", page }
    })
  }

  // 自营商品详情
  goodsHmDetails(gid) {
    return this.request({
      url: 'Apihmselected/goodsHmDetails',
      data: { source_mode: 1, yzdl: "yzdl", gid }
    })
  }

  // 确认订单
  ordersConfirmation(gid, token) {
    return this.request({
      url: 'Apihmselected/ordersConfirmation',
      data: { source_mode: 1, yzdl: "yzdl", gid, token }
    })
  }

  // 提交订单
  submissionOrder(params) {
    return this.request({
      url: 'Apihmselected/submissionOrder',
      data: { source_mode: 1, yzdl: "yzdl", type: 4, source_type: 2, ...params }
    })
  }
}
