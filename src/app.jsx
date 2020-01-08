import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";

import Index from "./pages/index";

import configStore from "./store";

import "taro-ui/dist/style/index.scss";
import "./app.less";

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  config = {
    pages: [
      "pages/home/index", // 首页
      "pages/special_list/index", // 专场
      "pages/reds_selection/index", // 红们精选
      "pages/product_detail/index", // 商品详情
      "pages/confirm_order/index", // 商品确认订单
      "pages/commodity_pay/index", // 商品支付
      "pages/enjoy_doctor/index", // 优享医生
      "pages/doctor_detail/index", // 医生详情
      "pages/doctor_pay/index", // 医生支付
      "pages/red_door_package/index", // 小礼包
      "pages/privilege/index", // 六大权益
      "pages/red_powder_vip/index", // 小礼包支付
      "pages/spree/index", // 管家大礼包
      "pages/carrier_gift_packs/index", // 运营商大礼包
      "pages/login/index", // 登录注册
      "pages/my/index", // 我的
      "pages/my_order/index", // 我的订单
      "pages/newbie_guide/index", // 我的订单
      "pages/index/index",
      // "pages/red_gift_exchange/index", // vip礼包兑换权益
      // "pages/red_gift_exchange_detail/index", // vip礼包兑换权益详情
      "pages/gift_red_exchange_detail/index",
      "pages/gift_red_exchange/index",
      "pages/notes/index", //卡卷列表
      "pages/note_detail/index", //卡卷详情
      "pages/note_hsptl/index", //卡卷医院列表查询
      "pages/note_expound/index", //卡卷 权益/详情 说明
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    }
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
