import HTTP from '@/utils/api'

export default class RichTextModel extends HTTP {
  // 新手指引
  noviceGuideDetails(gid) {
    return this.request({
      url: 'Apipersonal/noviceGuideDetails',
      data: { yzdl: 'yzdl', gid }
    })
  }

  // 店铺资质证明
  certificate(hid) {
    return this.request({
      url: 'Apihospital/certificate',
      data: { yzdl: 'yzdl', hid }
    })
  }
}