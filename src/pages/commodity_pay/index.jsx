import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import { getCahce } from "@/utils/cache";

import "./index.less";

export default class CommodityPay extends Component {
  state = {
    info: {}
  };

  componentWillMount() {
    if (getCahce("commodityPay")) {
      this.setState({ info: getCahce("commodityPay") });
    }
  }

  // 返回上一页
  onJump() {
    Taro.redirectTo({
      url: "/pages/confirm_order/index?gid=" + getCahce("commodityPay").id
    });
  }

  // 返回首页
  onHome() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }

  onConfirmPay() {}

  render() {
    let { info } = this.state;
    console.log(info);

    return (
      <View className="commodity_pay">
        <Navbar title="商品支付" onJump={this.onJump.bind(this)}>
          <Image
            className="nav_bar_home"
            src={image_domain + "home.png"}
            onClick={this.onHome.bind(this)}
          />
        </Navbar>
        <View className="red_powder_vip_top">
          <View className="red_powder_vip_top_flex">
            <Text>付款项目：</Text>
            <Text>
              {info.title.substring(0, 15)}
              {info.title.length > 15 && "..."}
            </Text>
          </View>
          <View className="red_powder_vip_top_flex">
            <Text>支付金额：</Text>
            <Text style={{ color: "#ff0000" }}>¥{info.price}</Text>
          </View>
        </View>
        <View className="red_powder_vip_center">
          <View className="red_powder_vip_center_title">支付方式</View>
          <View className="red_powder_vip_center_flex">
            <View>
              <Image
                className="red_selected"
                src={image_domain + "weChat_pay.png"}
              />
              <Text>微信支付</Text>
            </View>
            <Image
              className="red_selected"
              src={image_domain + "red_selected.png"}
              style={{ margin: "0" }}
            />
          </View>
        </View>
        <AtButton type="primary" onClick={this.onConfirmPay.bind(this)} circle>
          确认支付
        </AtButton>
      </View>
    );
  }
}
