import HTTP from '@/utils/api'

export default class NoteModel extends HTTP {

  noteList(params) {
    return this.request({
      url: 'Apicouponcard/index',
      data: { yzdl: "yzdl", ...params }
    });
  }
  noteDetails(params) {
    return this.request({
      url: 'Apicouponcard/cardDetails',
      data: { yzdl: "yzdl", time: new Date().getTime(), ...params }
    });
  }
  hsptlList(params){
    return this.request({
      url: 'Apicouponcard/getDoctor',
      data: { yzdl: "yzdl", ...params }
    });
  }
}