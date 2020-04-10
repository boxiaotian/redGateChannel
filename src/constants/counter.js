export const ADD = 'ADD'
export const MINUS = 'MINUS'
//http://192.168.0.105:10086/  https://app.hongmenpd.com/H5/#/  https://hm.hongmenpd.com/H5/#/
export const url_domain = ' https://app.hongmenpd.com/H5/#/'
export const image_domain = 'https://qiniu.hongmenpd.com/H5/images/'
export const formal_domain = 'https://app.hongmenpd.com/api/'  // https://app.hongmenpd.com/api/
export const package_privilege = [{  // 礼包特权
  image: image_domain + 'gift1.png',
  value: '先行赔付'
}, {
  image: image_domain + 'gift2.png',
  value: '消费返现'
}, {
  image: image_domain + 'gift3.png',
  value: '超值礼包'
}, {
  image: image_domain + 'gift4.png',
  value: '专属服务'
}, {
  image: image_domain + 'gift5.png',
  value: '精选医院'
}, {
  image: image_domain + 'gift6.png',
  value: '优享医生'
}, {
  image: image_domain + 'gift7.png',
  value: '大额优惠卷'
}, {
  image: image_domain + 'gift8.png',
  value: '全网独供'
}]
export const order_status = [{ // 我的订单
  image: image_domain + 'pending_payment.png',
  value: '待付款'
}, {
  image: image_domain + 'paid.png',
  value: '已付款'
}, {
  image: image_domain + 'unused.png',
  value: '未使用'
}, {
  image: image_domain + 'completed.png',
  value: '已完成'
}]

// 分享图标
export const share_icon = image_domain + 'share_icon.png';

export const my_key = [{
  image: image_domain + 'effort.png',
  value: '收益'
},{
  image: image_domain + 'order.png',
  value: '订单'
},{
  image: image_domain + 'follower.png',
  value: '粉丝'
},{
  image: image_domain + 'card.png',
  value: '卡券'
}]