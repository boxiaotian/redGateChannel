import Taro from "@tarojs/taro";
import HTTP from '@/utils/api'
import { isAndroid } from "@/utils/utils";

const http = new HTTP()

function getMemberInfo(params, type) {
  // type: 1小礼包购买
  return async dispatch => {
    let result = await http.request({ url: 'Apiwx/getMemberInfo', data: params })
    if (result.code !== 0) dispatch({ type: 'getMemberInfo', memberInfo: result })
  }
}

export { getMemberInfo }