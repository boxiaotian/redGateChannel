import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtCountdown, AtButton } from "taro-ui";

import { url_domain, image_domain } from "@/constants/counter";
import PackageModel from "@/models/package";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import { setCahce, getCahce } from "@/utils/cache";
import {
    onBridgeReady,
    getUrlKey,
    isWeiXin,
    isAndroid
} from "@/utils/utils";
import { redirect_uri } from "@/constants/global"

import "./index.less?v=0.0.1";

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
export default class stewardTenGift extends Component {
    config = {
        navigationBarTitleText: "直升运营商礼包"
    };
    state = {
        info: {}, // 礼包详情
        app_id: ""
    };

    componentWillMount() {
        if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
        packageModel.giftBagOperator().then(res => this.setState({ info: res }));

        // 公众号AppId
        weiXinModel.getConfig().then(res => this.setState({ app_id: res.app_id }));

        if (getUrlKey("code")) {
            this.props.onGetMemberInfo &&
                this.props.onGetMemberInfo({ code: getUrlKey("code") });
            setTimeout(() => {
                if (this.props.memberInfo && this.props.memberInfo.uid) {
                    weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
                        if (res.grade_id == 1 || res.grade_id == 2) {
                            this.ordergiftBagOperator(res.token);
                        } else if (res.grade_id == 3) {
                            Taro.showToast({
                                title: "您已是运营商",
                                icon: "none"
                            });
                        }
                    });
                } else {
                    setCahce("url", { url: "stewardTenGift" });
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

    // 购买
    onConfirmPay() {
        if (this.state.info.end_time == "0") {
            Taro.showToast({
                title: "大礼包活动已结束",
                icon: "none"
            });
        } else if (this.state.info.number == 0) {
            Taro.showToast({
                title: "管家礼包已被抢空了",
                icon: "none"
            });
        } else if (this.state.info.num == 0) {
            Taro.showToast({
                title: "大礼包库存不足",
                icon: "none"
            });
        } else {
            setCahce("url", { url: "stewardTenGift" });
            if (isWeiXin()) {
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
            } else {
                Taro.showToast({
                    title: "请使用微信打开",
                    icon: "none",
                    success: () => {
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
                });
            }
        }
    }

    // 支付
    ordergiftBagOperator(token) {
        if (getCahce("cid")) {
            packageModel
                .ordergiftBagOperator({
                    gid: this.state.info.id,
                    source_type_id:
                        getCahce("cid") && getCahce("cid").cid
                            ? getCahce("cid").cid
                            : "HB322085",
                    token
                })
                .then(res => this.BridgeReady(res));
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
                    success: () => {
                        // Taro.redirectTo({ url: "/pages/my_order/index?sort_current=2" });
                        window.location.href = url_domain + "myOrder?sort_current=2";
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

    render() {
        let { info } = this.state;
        return (
            <View className="gift_con">
                <View className="spree_stock_tate">
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
                <View className="operator_center">
                    <View className="spree_price_group">
                        <Text>¥ </Text>
                        <Text className="spree_price">
                        {info.price ? info.price : "29800.00"}
                        </Text>
                    </View>
                    <View className="spree_contain_package">
                        包含{info.number != undefined ? info.number : 10}个管家礼包
                     </View>
                </View>
                <AtButton
                    type="primary"
                    onClick={this.onConfirmPay.bind(this)}
                    circle
                />

            </View>
        );
    }
}
