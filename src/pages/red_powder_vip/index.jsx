import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";

import { Navbar } from "@/components/index";
import { url_domain, image_domain } from "@/constants/counter";
import PackageModel from "@/models/package";
import WeiXinModel from "@/models/weixin";
import { setCahce, getCahce } from "@/utils/cache";
import { onBridgeReady } from "@/utils/utils";

import "./index.less";

const packageModel = new PackageModel();
const weiXinModel = new WeiXinModel();

@connect(store => {
  return { memberInfo: store.user.memberInfo };
})
export default class RedPowderVip extends Component {
  state = {};

  componentWillUnmount() {
    setCahce("cid", {});
  }

  onJump() {
    // Taro.redirectTo({ url: "/pages/red_door_package/index" });
    window.location.href = url_domain + "redDoorPackage";
  }

  onConfirmPay() {
    let { memberInfo } = this.props;
    weiXinModel.selectUser(memberInfo.uid).then(res => {
      this.orderGiftBagc(res.token);
    });
  }

  // 支付
  orderGiftBagc(token) {
    packageModel
      .orderGiftBagc({
        gid: getCahce("packagePay").gid,
        source_type_id:
          getCahce("cid") && getCahce("cid").cid ? getCahce("cid").cid : "",
        source_type_share: getCahce("cid") && getCahce("cid").cid ? 2 : 1,
        token
      })
      .then(res => {
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
              Taro.redirectTo({ url: "/pages/my/index" });
            }, 1000);
          }
        });
      } else {
        Taro.showToast({
          title: "支付失败",
          icon: "none",
          success: () => {
            setTimeout(() => {
              // Taro.redirectTo({ url: "/pages/red_door_package/index" });
              window.location.href = url_domain + "redDoorPackage";
            }, 1000);
          }
        });
      }
    });
  }

  render() {
    return (
      <View className="red_powder_vip">
        <Navbar
          title="红粉VIP"
          color="#000000"
          onJump={this.onJump.bind(this)}
        />
        <View className="red_powder_vip_top">
          <View className="red_powder_vip_top_flex">
            <Text>开通服务：</Text>
            <Text>红粉VIP</Text>
          </View>
          <View className="red_powder_vip_top_flex">
            <Text>开通周期：</Text>
            <Text>年卡</Text>
          </View>
          <View className="red_powder_vip_top_flex">
            <Text>应付金额：</Text>
            <Text>¥{getCahce("packagePay").price}</Text>
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
