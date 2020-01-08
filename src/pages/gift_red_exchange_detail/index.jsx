import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Image, Text } from "@tarojs/components";
import { AtButton, AtDivider } from "taro-ui";
import { CustomNavBar } from "@/components";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import { setCahce } from "@/utils/cache";
import { getUrlKey, urlEncode, isWeiXin } from "@/utils/utils";
import { url_domain } from "@/constants/counter";
import { onBridgeReady } from "@/utils/utils";
import PackageModel from "@/models/package";

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
export default class GiftRedExchangeDetail extends Component {
  state = {
    app_id: "",
    details: {},
    exchange: 0 // 是否已兑换  1已经兑换
  };

  componentWillMount() {
    let id = getUrlKey("id");
    let exchange = getUrlKey("exchange");
    Taro.getStorage({ key: "GiftExchangeList" })
      .then(res => {
        if (res.errMsg === "getStorage:ok") {
          for (let index = 0; index < res.data.length; index++) {
            if (id == res.data[index].id) {
              this.setState({
                details: res.data[index]
              });
            }
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
      this.setState({
        exchange
      })
  }

  // 返回
  onJump() {
    Taro.navigateTo({ url: "/pages/gift_red_exchange/index" });
    // Taro.navigateBack({ delta: 1 });
  }

  // 立即兑换
  onPay() {
    packageModel
      .giftPackageExchange({
        token: this.props.memberInfo.token,
        geid: this.state.details.id,
        openid: this.props.memberInfo.openid
      })
      .then(res => {
        console.log("立即兑换", res);
        if (this.state.details.zk_final_price > 0) {
          this.BridgeReady(res);
        } else {
          this.setState({
            exchange :  "1"
          })
          Taro.showToast({
            title: "兑换成功",
            icon: "none",
            success: () => {
              setTimeout(() => {
                Taro.navigateTo({ url: "/pages/gift_red_exchange/index" });
                // window.location.href = url_domain + "redGiftExchange";
              }, 1000);
            }
          });
        }
      });
  }

  // 调取微信支付
  BridgeReady(res) {
    onBridgeReady(res).then(result => {
      if (result.err_msg == "get_brand_wcpay_request:ok") {
        this.setState({
          exchange : "1"
        })
        Taro.showToast({
          title: "支付成功,请前往APP查看",
          icon: "none"
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
    let { details } = this.state;

    return (
      <View className="product_details">
        <CustomNavBar
          title=""
          onJump={this.onJump.bind(this)}
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0)"
          }}
        />
        <View style={{ position: "relative" }}>
          <Image
            mode="widthFix"
            className="product_details_img"
            src={details.pict_url}
          />
        </View>
        <View className="product_details_top">
          <View>
            <Text className="product_final_prices">礼包价 ¥ </Text>
            <Text className="product_after_money">
              {" "}
              {details.zk_final_price && details.zk_final_price}
            </Text>
            {/* <Text className="product_final_price"> {details.zk_final_price && details.zk_final_price}</Text> */}
          </View>
          <View className="product_title">{details.title}</View>
          <View className="product_volume">已售 {details.volume}</View>
        </View>
        <View className="product_detail">
          {details.small_images &&
            details.small_images.map(item => {
              return (
                <Image
                  className="product_detail_img"
                  key={item.value}
                  src={item.value}
                />
              );
            })}
        </View>
        <View className="product_detail_pay">
          <View className="product_detail_pay_left">
            {details.zk_final_price && details.zk_final_price >= 0 ? (
              <View>
                <Text>会员资格 + </Text>
                <Text className="rnb"> ¥ </Text>
                <Text className="product_appointment_money_num">
                  {details.zk_final_price}
                </Text>
              </View>
            ) : (
              <View>
                <Text>红粉VIP会员资格兑换</Text>
              </View>
            )}
          </View>
          {this.state.exchange === "1" ? (
            <AtButton className="pay_btn">权益已使用</AtButton>
          ) : (
            <AtButton
              className="pay_btn"
              onClick={this.onPay.bind(this, details.id)}
            >
              立即兑换
            </AtButton>
          )}
        </View>
      </View>
    );
  }
}
