import HTTP from '@/utils/api'

export default class Effort extends HTTP {

  myProfit(params) {
    return this.request({
      url: 'Apipersonal/myProfit',
      data: { yzdl: "yzdl",type: 1,  ...params }
    });
  }

}
