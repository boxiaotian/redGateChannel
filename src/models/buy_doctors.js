import HTTP from '@/utils/api'

export default class BuyDoctorModel extends HTTP {
  // 团购医生列表
  doctorList(page = 0) {
    return this.request({
      url: 'Apiappointmentdoctor/doctorList',
      data: { source_mode: 1, yzdl: "yzdl", page }
    })
  }

  // 团购医生详情
  doctorDetails(id, token) {
    return this.request({
      url: 'Apiappointmentdoctor/doctorDetails',
      data: { source_mode: 1, yzdl: "yzdl", id, token }
    })
  }

  // 团购医生资质认证
  doctorDetailsProve(id) {
    return this.request({
      url: 'Apiappointmentdoctor/doctorDetailsProve',
      data: { source_mode: 1, yzdl: "yzdl", id }
    })
  }

  // 团购医生支付
  orderSubmission(params) {
    return this.request({
      url: 'Apiappointmentdoctor/orderSubmission',
      data: { source_mode: 1, yzdl: "yzdl", source_type: 2, type: 4, ...params }
    })
  }
}
