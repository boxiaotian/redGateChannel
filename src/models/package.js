import HTTP from '@/utils/api'

export default class PackageModel extends HTTP {
  // 小礼包详情
  giftBag() {
    return this.request({
      url: 'Apigiftbag/giftBag',
      data: { "source_mode": 1, "yzdl": "yzdl" }
    })
  }

  // 小礼包支付
  orderGiftBagc(params) {
    return this.request({
      url: 'Apigiftbag/orderGiftBagc',
      data: {
        type: 4,
        source_type: 2,
        yzdl: "yzdl",
        ...params
      }
    })
  }

  // 大礼包详情
  giftBagHousekeeperCard() {
    return this.request({
      url: 'Apigiftbag/giftBagHousekeeperCard',
      data: { "yzdl": "yzdl" }
    })
  }

  // 大礼包支付
  orderGiftBagHousekeeperCard(params) {
    return this.request({
      url: 'Apigiftbag/orderGiftBagHousekeeperCard',
      data: {
        type: 4,
        source_type: 2,
        yzdl: "yzdl",
        source_type_share: 2,
        ...params
      }
    })
  }
}