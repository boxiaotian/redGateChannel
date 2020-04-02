import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtGrid, AtCountdown, AtProgress, AtButton, AtTabBar } from "taro-ui";
import wx from "weixin-js-sdk";

import { Navbar } from "@/components/index";
import { package_privilege } from "@/constants/counter";
import PackageModel from "@/models/package";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import {
  getUrlKey,
  urlEncode,
  isWeiXin,
  isAndroid,
  initShareInfo
} from "@/utils/utils";
import { getCahce, setCahce } from "@/utils/cache";
import { redirect_uri } from "@/constants/global";

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
    app_id: "",
    endtime: new Date().getTime()
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
      this.setState({ app_id: res.app_id }, () => {
        this.getwx();
      });
    });
  }

  componentDidMount() {
    // 礼包详情
    packageModel.giftBag().then(res => {
      let proportion = (res.salenum / (res.salenum + res.num)) * 100;
      if(parseInt(res.giveaway.id)>0){
        res.detail_project = null;
        res['giveaway']['content_first'] = [res.giveaway.content[0]];
        res['giveaway']['content'] = res.giveaway.content.slice(1,res.giveaway.content.length);
        res.giveaway_id = res.giveaway.id;
        res.name = res.giveaway.name;
        res.detail_Image_text = [];
      }
      this.setState({ info: res, proportion });
    });
    let url = location.href.split("#")[0];
    setTimeout(() => {
      weiXinModel.getWechatConfig(url).then(res => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.appId, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名
          jsApiList: res.jsApiList // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {
          initShareInfo(
            wx,
            getCahce("member_info").code || getCahce("cid").cid
          );
        });
      });
    }, 2000);
  }

  getwx() {
    if (this.state.app_id) {
      if (!getUrlKey("code")) {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      } else {
        setCahce("url", {
          url:
            "redDoorPackage?cid=" + getUrlKey("cid") + "&id=" + getUrlKey("id")
        });
        this.props.onGetMemberInfo &&
          this.props.onGetMemberInfo({ code: getUrlKey("code") });
        setTimeout(() => {
          console.log("kaishi000000", this.props.memberInfo);
          if (this.props.memberInfo && this.props.memberInfo.token) {
            // weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
            //     console.log(res, "res");
            //     // this.setState({ info: res });
            // });
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

  // 返回首页
  onJump() {
    Taro.redirectTo({ url: "/pages/my/index" });
  }

  // 查看特权
  onPrivilege(item, index) {
    Taro.navigateTo({ url: "/pages/privilege/index?id=" + index });
  }

  //
  onExchange() {
    if (this.state.app_id) {
      if (!getUrlKey("code")) {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      } else {
        setCahce("url", { url: "redDoorPackage" });
        this.props.onGetMemberInfo &&
          this.props.onGetMemberInfo({ code: getUrlKey("code") });
        setTimeout(() => {
          if (this.props.memberInfo && this.props.memberInfo.token) {
            weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
              // this.setState({ info: res });
              // Taro.navigateTo({ url: "/pages/gift_red_exchange/index"});
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
  //
  getlogin() {
    if (this.state.app_id) {
      if (!getUrlKey("code")) {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      } else {
        setCahce("url", { url: "redDoorPackage" });
        this.props.onGetMemberInfo &&
          this.props.onGetMemberInfo({ code: getUrlKey("code") });
        setTimeout(() => {
          console.log(this.props.memberInfo);
          if (this.props.memberInfo && this.props.memberInfo.token) {
            weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
              console.log("res", res);

              this.setState({ info: res });
              Taro.navigateTo({ url: "/pages/red_powder_vip/index" });
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
      // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      this.getlogin();
    } else {
      Taro.showToast({
        title: "请下载APP购买或使用微信打开",
        icon: "none",
        success: () => {
          setTimeout(() => {
            if (isAndroid())
              window.location.href =
                "http://app.mi.com/details?id=com.ticketapp&ref=search";
            else
              window.location.href =
                "https://apps.apple.com/cn/app/%E7%BA%A2%E9%97%A8%E9%A2%91%E5%88%B0/id1485553352";
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
        window.location.href =
          "http://app.mi.com/details?id=com.ticketapp&ref=search";
      } else {
        window.location.href =
          "https://apps.apple.com/cn/app/%E7%BA%A2%E9%97%A8%E9%A2%91%E5%88%B0/id1485553352";
      }
    }, 1000);
  }

  HTMLDecode = text => {
    var temp = document.createElement("div");

    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;

    temp = null;
    return output;
  };

  render() {
    let {
      info,
      proportion,
      package_privilege,
      detail_tab,
      details_current,
      endtime
    } = this.state;
    let status = true;
    if (endtime > info.end_time1 * 1000) {
      status = false; // 活动时间结束
    }

    return (
      <View className="red_door_package">
        <Navbar title="会员权益" onJump={this.onJump.bind(this)} />
        {/* <View className="package_top_group">
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
        </View> */}
        <View>
          {info.detail_project && (
            <Image src={info.detail_Image_text[0].value} />
          )}
        </View>
        <View>
          {info.giveaway && info.giveaway.id > 0  && (
            <Image src={info.giveaway.content_first[0].value} />
          )}
        </View>
        <View className="package_center_group">
          <View className="package_price_date">
            <View className="package_price">
              <View className="package_price_lable">{info.name}</View>
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
            <View onClick={this.onExchange.bind(this)}>
              {info.detail_project &&
                info.detail_project.map(item => {
                  return <Image key={item.value} src={item.value} />;
                })}
            </View>
          ) : (
            <View onClick={this.onExchange.bind(this)}>
              {info.detail_Image_text &&
                info.detail_Image_text.map((item, i) => {
                  if (i > 0) {
                    return <Image key={item.value} src={item.value} />;
                  }
                })}
            </View>
          )}
          {info.giveaway && info.giveaway.id > 0 ? (
            <View onClick={this.onExchange.bind(this)}>
              {info.giveaway.content &&
                info.giveaway.content.map(item => {
                  return <Image key={item.value} src={item.value} />;
                })}
            </View>
          ) : (
            ""
          )}
        </View>
        <View className="package_pay">
          <View className="package_pay_title">
            限时心动价 <Text>{info.price}</Text>元/年
          </View>
          {info.num === 0 || !status ? (
            <AtButton type="primary">活动已结束</AtButton>
          ) : (
            <AtButton type="primary" onClick={this.onOpen.bind(this)}>
              立即开通
            </AtButton>
          )}
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
