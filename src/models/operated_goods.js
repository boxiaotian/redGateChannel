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
}
