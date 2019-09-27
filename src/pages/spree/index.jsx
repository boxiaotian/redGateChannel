import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtCountdown, AtButton } from "taro-ui";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import PackageModel from "@/models/package";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import { setCahce } from "@/utils/cache";
import {
  onBridgeReady,
  getUrlKey,
  urlEncode,
  isWeiXin,
  isAndroid
} from "@/utils/utils";

import "./index.less";

const packageModel = new PackageModel();
const weiXinModel = new WeiXinModel();

@connect(
  store => {
    return { memberInfo: store.user.memberInfo };
  },
  dispatch => {
    return {
      onGetMemberInfo(params) {
        dispatch(getMemberInfo(params));
      }
    };
  }
)
export default class Spree extends Component {
  state = {
    info: {}, // 大礼包详情
    app_id: ""
  };

  componentWillMount() {
    packageModel.giftBagHousekeeperCard().then(res => {
      this.setState({ info: res });
    });

    // 公众号AppId
    weiXinModel.getConfig().then(res => {
      this.setState({ app_id: res.app_id });
    });
  }

  onJump() {}

  // 购买
  onConfirmPay() {
    if (isWeiXin()) {
      console.log("微信");
      let code = getUrlKey("code"); // 微信code
      // let redirect_uri = urlEncode("https://hm.hongmenpd.com/wxauth.php");
      let redirect_uri = urlEncode(window.location.href);
      if (!code) {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        Taro.showToast({
          title: "已授权，请继续购买",
          icon: "none"
        });
      } else {
        this.props.onGetMemberInfo &&
          this.props.onGetMemberInfo({ code: getUrlKey("code") });
        setCahce("url", { url: "spree" });
        setTimeout(() => {
          weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
            if (res.grade_id == 1 && res.vip == 1) {
              this.orderGiftBagHousekeeperCard(res.token);
            } else if (res.grade_id == 1 && res.vip == 0) {
              Taro.showToast({
                title: "您不是红粉VIP",
                icon: "none",
                success: () => {
                  setTimeout(() => {
                    Taro.reLaunch({ url: "/pages/red_door_package/index" });
                  }, 1000);
                }
              });
            } else if (res.grade_id == 2 || res.grade_id == 3) {
              Taro.showToast({
                title: "您已是管家或运营商",
                icon: "none"
              });
            }
          });
        }, 1500);
      }
    } else {
      Taro.showToast({
        title: "请下载APP购买或使用微信打开",
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
      });
    }
  }

  // 支付
  orderGiftBagHousekeeperCard(token) {
    if (getUrlKey("cid")) {
      packageModel
        .orderGiftBagHousekeeperCard({
          gid: this.state.info.id,
          source_type_id: getUrlKey("cid"),
          token
        })
        .then(res => {
          this.BridgeReady(res);
        });
    } else {
      Taro.showToast({
        title: "该礼包只能通过分享购买",
        icon: "none"
      });
    }
  }

  // 调取微信支付
  BridgeReady(res) {
    onBridgeReady(res).then(result => {
      if (result.err_msg == "get_brand_wcpay_request:ok") {
        Taro.showToast({
          title: "支付成功",
          icon: "none",
          success: () => {}
        });
      } else {
        Taro.showToast({
          title: "支付失败",
          icon: "none"
        });
      }
    });
  }

  render() {
    let { info } = this.state;
    let price = info.price && info.price.split(".");

    return (
      <View className="spree">
        <Navbar
          title="直升管家大礼包"
          color="#000000"
          onJump={this.onJump.bind(this)}
        />
        <Image src={image_domain + "spree_title.png"} />
        <View className="spree_stock_tate">
          <Text className="spree_stock">仅剩：{info.num}</Text>
          <Text>倒计时：</Text>
          <AtCountdown
            isShowDay={info.day ? true : false}
            isShowHour
            format={{ day: "天", hours: ":", minutes: ":", seconds: "" }}
            day={info.day}
            hours={info.hour}
            minutes={info.minute}
            seconds={info.second}
          />
        </View>
        <View className="spree_content">
          <View className="spree_content_title">{info.name}</View>
          <View className="spree_content_pinyin">GIFT PACKS</View>
          <View className="spree_price_group">
            <Text className="spree_price_symbol">¥ </Text>
            <Text className="spree_price">{price && price[0]}</Text>
            <Text className="spree_price_decimal">.{price && price[1]}</Text>
          </View>
          <View className="spree_contain_package">包含{}个VIP礼包</View>
          <AtButton
            type="primary"
            onClick={this.onConfirmPay.bind(this)}
            circle
          >
            立即购买成为管家
          </AtButton>
        </View>
      </View>
    );
  }
}
