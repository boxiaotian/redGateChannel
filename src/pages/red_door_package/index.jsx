import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtGrid, AtCountdown, AtProgress, AtButton, AtTabBar } from "taro-ui";

import { Navbar } from "@/components/index";
import { package_privilege } from "@/constants/counter";
import PackageModel from "@/models/package";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import { getUrlKey, urlEncode, isWeiXin, isAndroid } from "@/utils/utils";
import { getCahce, setCahce } from "@/utils/cache";

import "./index.less";
import { image_domain } from "@/constants/counter";

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
export default class RedDoorPackage extends Component {
  state = {
    info: {}, // 小礼包详情
    proportion: "0%",
    package_privilege, // 礼包特权
    detail_tab: [{ title: "图文详情" }, { title: "项目详情" }],
    details_current: 0,
    app_id: ""
  };

  componentWillMount() {
    if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });

    // 礼包详情
    packageModel.giftBag().then(res => {
      let proportion = (res.salenum / (res.salenum + res.num)) * 100;
      this.setState({ info: res, proportion });
    });

    // 公众号AppId
    weiXinModel.getConfig().then(res => {
      this.setState({ app_id: res.app_id });
    });

    // console.log(this.props.memberInfo ,"this.props.memberInfo");
    // setCahce("member_info",{})
    // if (getUrlKey("code")) {
    //   this.props.onGetMemberInfo &&
    //     this.props.onGetMemberInfo({ code: getUrlKey("code") });
    //     setTimeout(() => {
    //     if (this.props.memberInfo != undefined && this.props.memberInfo.uid) {
    //       weiXinModel.selectUser(228).then(res => {
    //         setCahce("member_info", res);
    //         // if (res.grade_id && res.vip) {
    //         //   Taro.showToast({
    //         //     title: "您已是红粉VIP,请前往APP查看",
    //         //     icon: "none",
    //         //     success: () => {
    //         //       setTimeout(() => {
    //         //         if (isAndroid())
    //         //           window.location.href = "http://app.mi.com/details?id=com.ticketapp&ref=search";
    //         //         else window.location.href = "https://apps.apple.com/cn/app/%E7%BA%A2%E9%97%A8%E9%A2%91%E5%88%B0/id1485553352";
    //         //       }, 1000);
    //         //     }
    //         //   });
    //         // } else Taro.navigateTo({ url: "/pages/red_powder_vip/index" });
    //       });
    //     } else {
    //       Taro.showToast({
    //         title: "请登录注册",
    //         icon: "none",
    //         success: () => {
    //           setTimeout(() => {
    //             Taro.redirectTo({ url: "/pages/login/index" });
    //           }, 1000);
    //         }
    //       });
    //     }
    //   }, 1000);
    // }
  }

  // 返回首页
  onJump() {
    Taro.redirectTo({ url: "/pages/my/index" });
  }

  // 查看特权
  onPrivilege(item, index) {
    Taro.navigateTo({ url: "/pages/privilege/index?id=" + index });
  }
  
  //  vip礼包兑换权益
  onPrivilege(item, index) {
    Taro.navigateTo({ url: "/pages/privilege/index?id=" + index });
  }

    //  vip礼包兑换权益
    onExchange() {
      
      if (this.state.app_id) {
        // let redirect_uri = urlEncode("https://hm.hongmenpd.com/wxauth.php"); // 开发
        let redirect_uri = urlEncode(window.location.href); // 正式
        if (!getUrlKey("code")) {
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
        } else {
          setCahce("url", { url: "redDoorPackage" });
          this.props.onGetMemberInfo &&
            this.props.onGetMemberInfo({ code: getUrlKey("code") });
          setTimeout(() => {
            if (this.props.memberInfo && this.props.memberInfo.uid) {
              weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
                this.setState({ info: res });
                Taro.navigateTo({ url: "/pages/red_gift_exchange/index"});
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

  // 详情切换
  onDetailTab(details_current) {
    this.setState({ details_current });
  }

  // 立即开通
  onOpen() {
    let { app_id, info } = this.state;
    setCahce("url", { url: "redDoorPackage" });
    setCahce("packagePay", { gid: info.id, price: info.price });

    if (isWeiXin()) {
      // let redirect_uri = urlEncode("https://hm.hongmenpd.com/wxauth.php");
      let redirect_uri = urlEncode(window.location.href);
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    } else {
      Taro.showToast({
        title: "请下载APP购买或使用微信打开",
        icon: "none",
        success: () => {
          setTimeout(() => {
            if (isAndroid())
              window.location.href = "http://app.mi.com/details?id=com.ticketapp&ref=search";
            else window.location.href = "https://apps.apple.com/cn/app/%E7%BA%A2%E9%97%A8%E9%A2%91%E5%88%B0/id1485553352";
          }, 1000);
        }
      });
    }
  }

  // 联系客服
  onHelpService() {
    Taro.showToast({
      title: "请下载APP联系客服",
      icon: "none"
    });
    setTimeout(() => {
      if (isAndroid()) {
        window.location.href = "http://app.mi.com/details?id=com.ticketapp&ref=search";
      } else {
        window.location.href = "https://apps.apple.com/cn/app/%E7%BA%A2%E9%97%A8%E9%A2%91%E5%88%B0/id1485553352";
      }
    }, 1000);
  }

  render() {
    let {
      info,
      proportion,
      package_privilege,
      detail_tab,
      details_current
    } = this.state;

    return (
      <View className="red_door_package">
        <Navbar title="红门礼包" onJump={this.onJump.bind(this)} />
        <View className="package_top_group">
          <View className="package_panel">
            <View className="package_identity">红粉</View>
            <View className="package_nickname">昵称</View>
            <View>VIP会员平均每年可省25493，更可享受更多权益</View>
          </View>
          <View className="package_privilege">
            <AtGrid
              onClick={this.onPrivilege.bind(this)}
              data={package_privilege}
              hasBorder={false}
              columnNum={4}
            />
          </View>
        </View>
        <View className="package_center_group">
          <View className="package_price_date">
            <View className="package_price">
              <View className="package_price_lable">限时特卖</View>
              <View>¥{info.price}</View>
            </View>
            <View className="package_date">
              <View className="package_date_content">
                <Text className="package_date_title">距结束</Text>
                <AtCountdown
                  format={{ day: "天", hours: ":", minutes: ":", seconds: "" }}
                  day={info.day}
                  hours={info.hours}
                  minutes={info.minutes}
                  seconds={info.seconds}
                  isCard
                  isShowDay={info.day ? true : false}
                  isShowHour
                />
              </View>
              <View className="package_sales_volume">
                <View className="package_has_robbed">已抢{info.salenum}</View>
                <AtProgress percent={proportion} isHidePercent />
                <View className="package_only_left">仅剩{info.num}</View>
              </View>
            </View>
          </View>
          <View className="package_content">
            {/* <View>{info.name}</View>
            <View className="package_introduction">{info.shortname}</View> */}
          </View>
        </View>
        <View className="package_details">
          {/* <AtTabBar
            tabList={detail_tab}
            onClick={this.onDetailTab.bind(this)}
            current={details_current}
            color="#666666"
            selectedColor="#000000" 
          /> */}
          {details_current ? (
            <View 
            onClick={this.onExchange.bind(this)}
            >
              {info.detail_project &&
                info.detail_project.map(item => {
                  return <Image key={item.value} src={item.value} />;
                })}
            </View>
          ) : (
            <View
            onClick={this.onExchange.bind(this)}
            >
              {info.detail_Image_text &&
                info.detail_Image_text.map(item => {
                  return <Image key={item.value} src={item.value} />;
                })}
            </View>
          )}
        </View>
        <View className="package_pay">
          <View className="package_pay_title">限时特惠￥{info.price}/年</View>
          <AtButton type="primary" onClick={this.onOpen.bind(this)}>
            立即开通
          </AtButton>
        </View>
        <Image
          className="service"
          src={image_domain + "customer_service.png"}
          onClick={this.onHelpService.bind(this)}
        />
      </View>
    );
  }
}
