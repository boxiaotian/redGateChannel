import HTTP from "@/utils/api";

export default class PackageModel extends HTTP {
  // 小礼包详情
  giftBag() {
    return this.request({
      url: "Apigiftbag/giftBag",
      data: { source_mode: 1, yzdl: "yzdl" }
    });
  }

  // 小礼包支付
  orderGiftBagc(params) {
    return this.request({
      url: "Apigiftbag/orderGiftBagc",
      data: {
        type: 4,
        source_type: 2,
        yzdl: "yzdl",
        ...params
      }
    });
  }

  // 管家大礼包详情
  giftBagHousekeeperCard() {
    return this.request({
      url: "Apigiftbag/giftBagHousekeeperCard",
      data: { yzdl: "yzdl" }
    });
  }

  // 管家大礼包支付
  orderGiftBagHousekeeperCard(params) {
    return this.request({
      url: "Apigiftbag/orderGiftBagHousekeeperCard",
      data: {
        type: 4,
        source_type: 2,
        yzdl: "yzdl",
        source_type_share: 2,
        ...params
      }
    });
  }

  // 运营商大礼包
  giftBagOperator() {
    return this.request({
      url: "Apigiftbag/giftBagOperator",
      data: { yzdl: "yzdl" }
    });
  }

  // 运营商大礼包支付
  ordergiftBagOperator(params) {
    return this.request({
      url: "Apigiftbag/ordergiftBagOperator",
      data: { yzdl: "yzdl", type: 4, source_type: 2, ...params }
    });
  }

  // 礼包兑换列表
  giftExchangeList(params) {
    return this.request({
      url: "Apigiftbag/giftExchangeList",
      data: { yzdl: "yzdl", page: 0, ...params }
    });
  }
  // 礼包兑换 - 提交订单
  giftPackageExchange(params) {
    return this.request({
      url: "Apigiftbag/giftPackageExchange",
      data: { yzdl: "yzdl", type: 4, ...params }
    });
  }
}
