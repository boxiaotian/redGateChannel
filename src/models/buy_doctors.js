import HTTP from '@/utils/api'

export default class BuyDoctorModel extends HTTP {
  // 自营商品列表
  doctorList(page = 0) {
    return this.request({
      url: 'Apiappointmentdoctor/doctorList',
      data: { source_mode: 1, yzdl: "yzdl", page }
    })
  }
}
