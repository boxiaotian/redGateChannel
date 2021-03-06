import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { Navbar } from "@/components/index";
import { url_domain, image_domain } from "@/constants/counter";
import BuyDoctorModel from "@/models/buy_doctors";
import { setCahce, getCahce } from "@/utils/cache";
import { onBridgeReady } from "@/utils/utils";

import "./index.less";

const buyDoctorModel = new BuyDoctorModel();

export default class DoctorPay extends Component {
  state = {
    info: {}
  };

  componentWillMount() {
    setCahce("isdoctorPay", { isPay: false });
    if (getCahce("doctorPay")) {
      this.setState({ info: getCahce("doctorPay") });
    }
  }

  // 返回上一页
  onJump() {
    // Taro.redirectTo({ url: "/pages/red_door_package/index" });
    window.location.href = url_domain + getCahce("url").url;
  }

  // 返回首页
  onHome() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }

  // 团购医生支付
  onConfirmPay() {
    buyDoctorModel.orderSubmission(this.state.info).then(res => {
      this.BridgeReady(res);
    });
  }

  // 调取微信支付
  BridgeReady(res) {
    onBridgeReady(res).then(result => {
      if (result.err_msg == "get_brand_wcpay_request:ok") {
        Taro.showToast({
          title: "支付成功",
          icon: "none",
          success: () => {
            setTimeout(() => {
              // Taro.redirectTo({ url: "/pages/my/index" });
              window.location.href = url_domain + "myOrder?sort_current=1";
            }, 1000);
          }
        });
      } else {
        Taro.showToast({
          title: "支付失败",
          icon: "none",
          success: () => {
            setTimeout(() => {
              // Taro.redirectTo({ url: "/pages/my/index" });
              window.location.href = url_domain + "myOrder?sort_current=1";
            }, 1000);
          }
        });
      }
    });
  }

  render() {
    let { info } = this.state;

    return (
      <View className="commodity_pay">
        <Navbar title="团购医生支付" onJump={this.onJump.bind(this)}>
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
              {info.name.substring(0, 15)}
              {info.name.length > 15 && "..."}
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
