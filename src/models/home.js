import HTTP from '@/utils/api'

export default class HomeModel extends HTTP {
  // 轮播图
  rotationChart(type = 1) {
    return this.request({
      url: 'Apiindex/rotationChart',
      data: { source_mode: 1, yzdl: "yzdl", type }
    })
  }

  // 首页专场
  specialField(page = 0) {
    return this.request({
      url: 'Apiindex/specialField',
      data: { source_mode: 1, yzdl: "yzdl", page }
    })
  }

  // 首页专场-商品列表
  specialFieldGoods(page = 0, fid) {
    return this.request({
      url: 'Apiindex/specialFieldGoods',
      data: { source_mode: 1, yzdl: "yzdl", page, fid }
    })
  }

  // 首页红门特惠
  goodsPreferential(page = 0) {
    return this.request({
      url: 'Apiindex/goodsPreferential',
      data: { source_mode: 1, yzdl: "yzdl", page }
    })
  }
}
