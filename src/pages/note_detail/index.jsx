import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Navbar } from "@/components/index";
import { AtButton } from "taro-ui";
import { AtIcon } from "taro-ui";
import { connect } from "@tarojs/redux";
import { getMemberInfo } from "@/redux/actions/user";
import { setCahce, getCahce } from "@/utils/cache";
import NoteModel from "@/models/note";
import { onBridgeReady } from "@/utils/utils";
import { getUrlKey, urlEncode, isWeiXin } from "@/utils/utils";
import { url_domain } from "@/constants/counter";
import { redirect_uri } from "@/constants/global"

import WeiXinModel from "@/models/weixin";
const noteModel = new NoteModel();
const weiXinModel = new WeiXinModel();

import "./index.less";

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
export default class NoteDetail extends Component {
  state = {
    details: {},
    info: this.props.memberInfo,
    app_id: "",
    id: getUrlKey("id") || getCahce("id").id,
    loding: true
  };

  componentDidMount() {
    if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
    if (getUrlKey("id")) setCahce("id", { id: getUrlKey("id") });

    this.noteDetail();

    if (!getUrlKey("code")) {
      weiXinModel.getConfig().then(res => {
        this.setState({ app_id: res.app_id }, () => {
          this.getwxcode();
        });
      });
    } else {
      this.props.onGetMemberInfo &&
        this.props.onGetMemberInfo({ code: getUrlKey("code") });
      setTimeout(() => {
        console.log("获取用户信息了", this.props.memberInfo);
        if (this.props.memberInfo && this.props.memberInfo.token) {
          weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
            console.log(res, "res");
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
      }, 1500);
    }
    console.log("xxxxxx", this.props.memberInfo);
  }


  // 第一步微信授权
  getwxcode = () => {
    if (isWeiXin()) {
      setCahce("url", { url: "noteDetail" });
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    } else {
      Taro.showToast({
        title: "请下载APP购买或使用微信打开",
        icon: "none"
      });
    }
  };

  //卡券详情
  noteDetail() {
    noteModel.noteDetails({ id: this.state.id }).then(res => {
      this.setState({ details: res });
    });
  }

  // 返回
  onJump() {
    Taro.redirectTo({ url: "/pages/notes/index" });
  }

  onPay() {
    // 未登录则授权
    if (this.props.memberInfo && this.props.memberInfo.token) {
      let cid = getCahce("cid");
      // console.log(cid);
      let params = {
        token: this.props.memberInfo.token,
        id: this.state.id,
        source_type_id: this.props.memberInfo.openid
      };
      if (cid) {
        params.cid = cid.cid;
      }

      noteModel.cardPay(params).then(res => {
        console.log("res", res);
        this.BridgeReady(res);
      });
    } else {
      this.getwxcode();
    }
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
              window.location.href = url_domain + "myOrder?sort_current=1";
            }, 1000);
          }
        });
      } else {
        Taro.showToast({
          title: "支付失败,请重新进入",
          icon: "none"
        });
      }
    });
  }
  onUsage(type) {
    let { details } = this.state;
    let params = {
      // id: details.id,
      usemust: type == 1 ? details.equity : details.usemust,
      title: type == 1 ? "权益说明" : "使用须知"
    };
    setCahce("noteUsg", params);
    Taro.navigateTo({ url: "/pages/note_expound/index" });
  }
  onHsptl(id) {
    Taro.navigateTo({ url: "/pages/note_hsptl/index?id=" + id });
  }

  render() {
    let { details, id } = this.state;
    return (
      <View className="note_details">
        <View className="note_details_navbar">
          <Navbar onJump={this.onJump.bind(this)} />
        </View>
        <View className="note_detail_container">
          <View className="note_detail_price">
            <Text>{details.price}元</Text>
          </View>
          <View className="note_detail_useage">
            <Text>{details.title}项目使用</Text>
          </View>
          {/* <View className="note_detail_exchange">
                    <Text>兑换码：{details.code}</Text>

                    <AtButton
                        className="note_copy_btn"
                        type="primary"
                        size="small"
                        circle
                    >
                        复制
                    </AtButton>

                </View> */}
          {/* <View className="note_detail_money">
                    <Text>分享可赚:¥{details.share}</Text>
                    <Text>消费返现:¥{details.purchase}</Text>
                </View> */}
          <View className="note_detail_buy">
            <AtButton
              className="note_buy_btn"
              type="primary"
              size="small"
              circle
              onClick={this.onPay.bind(this)}
            >
              立即购买
            </AtButton>
          </View>
          <View className="note_detail_hosptl">
            <Text>指定医院可用</Text>
          </View>
          <View className="node_detail_explain">
            <View className="node_detail_explainli">
              <Text>有效期</Text>
              <Text>
                {details.start_time}&nbsp;-&nbsp;{details.end_time}
              </Text>
            </View>
            <View
              className="node_detail_explainli"
              onClick={this.onUsage.bind(this, 1)}
            >
              <Text>权益说明</Text>
              <AtIcon value="chevron-right" size="13" color="#666" />
            </View>
            <View
              className="node_detail_explainli"
              onClick={this.onHsptl.bind(this, id)}
            >
              <Text>可用医院</Text>
              <AtIcon value="chevron-right" size="13" color="#666" />
            </View>
            <View
              className="node_detail_explainli"
              onClick={this.onUsage.bind(this, 2)}
            >
              <Text>使用须知</Text>
              <AtIcon value="chevron-right" size="13" color="#666" />
              <View className={["dot", "dot-left"]}></View>
              <View className={["dot", "dot-right"]}></View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
