import HTTP from '@/utils/api'

export default class EffortModel extends HTTP {

  myProfit(params) {
    return this.request({
      url: '/Apiprofit/myProfit',
      data: { yzdl: "yzdl",  ...params }
    });
  }

}
