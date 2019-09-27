import Taro from "@tarojs/taro";
import HTTP from '@/utils/api'
import { isAndroid } from "@/utils/utils";

const http = new HTTP()

function getMemberInfo(params, type) {
  // type: 1小礼包购买
  return async dispatch => {
    let result = await http.request({ url: 'Apiwx/getMemberInfo', data: params })
    dispatch({ type: 'getMemberInfo', memberInfo: result })
    if (result.uid) {
      if (type == 1) {
        if (result.grade_id && result.vip) {
          Taro.showToast({
            title: "您已是红粉VIP,请前往APP查看",
            icon: "none",
            success: () => {
              setTimeout(() => {
                if (isAndroid()) {
                  window.location.href = "https://51gsc.com/app/Fqkr";
                } else {
                  window.location.href = "https://51gsc.com/app/6DZx";
                }
              }, 1000);
            }
          })
        } else {
          Taro.navigateTo({ url: "/pages/red_powder_vip/index" })
        }
      }
    } else {
      Taro.showToast({
        title: "请登录注册", icon: "none", success: () => {
          setTimeout(() => {
            Taro.redirectTo({ url: "/pages/login/index" })
          }, 1000);
        }
      })
    }
  }
}

export { getMemberInfo }