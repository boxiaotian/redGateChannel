import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtGrid, AtList, AtListItem, AtButton } from "taro-ui";

import { Navbar } from "@/components/index";
import { url_domain, image_domain, order_status } from "@/constants/counter";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import { getCahce, setCahce } from "@/utils/cache";
import { isAndroid, getUrlKey, urlEncode } from "@/utils/utils";

import "./index.less";

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
export default class My extends Component {
  state = {
    info: {},
    my_order_data: order_status
  };

  componentWillMount() {
    Taro.removeStorageSync("cid");
    if (getCahce("appid")) {
      // let redirect_uri = urlEncode("https://hm.hongmenpd.com/wxauth.php"); // 开发
      let redirect_uri = urlEncode(window.location.href); // 正式
      if (!getUrlKey("code")) {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          getCahce("appid").appid
        }&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      } else {
        setCahce("url", { url: "my" });
        this.props.onGetMemberInfo &&
          this.props.onGetMemberInfo({ code: getUrlKey("code") });
        setTimeout(() => {
          if (this.props.memberInfo && this.props.memberInfo.uid) {
            weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
              this.setState({ info: res });
            });
          } else {
            Taro.showToast({
              title: "请登录注册",
              icon: "none",
              success: () => {
                setTimeout(() => {
                  Taro.redirectTo({ url: "/pages/login/index" });
                }, 1000);
              }
            });
          }
        }, 1000);
      }
    }
  }

  onJump() {
    Taro.redirectTo({ url: "/pages/red_door_package/index" });
    // window.location.href = url_domain + "home";
  }

  onAllOrder(item, index) {
    let status;
    if (index === undefined) status = 0;
    else if (index == 1 || index == 2) status = 2;
    else if (index == 3) status = 3;
    else status = 1;
    Taro.navigateTo({
      url: "/pages/my_order/index?sort_current=0&status_current=" + status
    });
  }

  onPackage() {
    if (this.props.memberInfo.vip) {
      Taro.navigateTo({ url: "/pages/my_order/index?sort_current=2" });
    } else {
      Taro.redirectTo({ url: "/pages/red_door_package/index" });
      // window.location.href = url_domain + "redDoorPackage";
    }
  }

  onHelpService() {
    Taro.showToast({
      title: "请下载APP联系客服",
      icon: "none"
    });
    setTimeout(() => {
      if (isAndroid()) {
        window.location.href =
          "http://app.mi.com/details?id=com.ticketapp&ref=search";
      } else {
        window.location.href =
          "https://apps.apple.com/cn/app/%E7%BA%A2%E9%97%A8%E9%A2%91%E5%88%B0/id1485553352";
      }
    }, 1000);
  }

  render() {
    let { info, my_order_data } = this.state;
    let { memberInfo } = this.props;

    return (
      <View className="my">
        <Navbar title="我的" onJump={this.onJump.bind(this)} />
        <View className="my_content">
          <View className="my_info">
            <Image className="my_info_avatar" src={info.portrait} />
            <Text>{info.name}</Text>
          </View>
          <View className="my_order">
            <View className="my_order_top">
              <Text>我的订单</Text>
              <Text
                className="my_all_order"
                onClick={this.onAllOrder.bind(this)}
              >
                查看全部
              </Text>
            </View>
            <AtGrid
              onClick={this.onAllOrder.bind(this)}
              data={my_order_data}
              hasBorder={false}
              columnNum="4"
            />
          </View>
        </View>
        <View className="my_gift_package">
          <Image
            className="my_gift_package_img"
            src={image_domain + "crown.png"}
          />
          <Text style={{ marginLeft: "-36px" }}>
            购买礼包升级VIP享多种特权权限
          </Text>
          <AtButton size="small" onClick={this.onPackage.bind(this)}>
            {memberInfo.vip ? "查看订单" : "立即购买"}
          </AtButton>
        </View>
        <AtList hasBorder={false}>
          <AtListItem
            title="帮助与客服"
            arrow="right"
            onClick={this.onHelpService.bind(this)}
            hasBorder={false}
          />
        </AtList>
      </View>
    );
  }
}
