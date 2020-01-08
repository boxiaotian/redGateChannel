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
export default class Login extends Component {
    state = {
        details: {},
        info: this.props.memberInfo,
        app_id: "",
        page: 0,
        id: ""
    };
    componentWillMount() {
        if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
        if (this.$router.params.id) this.noteDetail();
        console.log(this.$router.params)
        // Taro.redirectTo({ url: "/pages/home/index" });
        // 公众号AppId
        weiXinModel.getConfig().then(res => {
            this.setState({ app_id: res.app_id });
        });


    }
    noteDetail() {
        let note_data = {};
        noteModel
            .noteDetails({ id: this.$router.params.id, token: this.state.info.token, page: this.state.page })
            .then(res => {
                note_data = res;
                this.setState({ details: note_data, id: this.$router.params.id });
            });
    }
    // 返回
    onJump() {
        Taro.redirectTo({ url: "/pages/notes/index" });
    }
    onPay() {
        if (!this.props.memberInfo.token) {
            if (this.state.app_id) {
                let redirect_uri = urlEncode("https://hm.hongmenpd.com/wxauth.php"); // 开发
                // let redirect_uri = urlEncode(window.location.href); // 
                // console.log(getUrlKey("code"))//
                if (!getUrlKey("code")) {
                    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
                } else {
                    setCahce("url", { url: "noteDetail" });
                    this.props.onGetMemberInfo &&
                        this.props.onGetMemberInfo({ code: getUrlKey("code") });
                    setTimeout(() => {
                        if (this.props.memberInfo && this.props.memberInfo.token) {
                            this.notePay();
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

        } else {
            this.notePay()
        }
    }

    notePay() {
        let cid = getCahce("cid");
        let params = {
          token: this.props.memberInfo.token,
          id: this.$router.params.id,
          source_type_id: this.props.memberInfo.openid
        }
        if (cid) {
          params.cid = cid
        }
        noteModel
            .cardPay({
                token: this.props.memberInfo.token,
                id: this.$router.params.id,
                source_type_id: this.props.memberInfo.openid
            })
            .then(res => {
                if (res.code == 1) {
                    this.BridgeReady(res);
                } else {
                    Taro.showToast({
                        title: res.msg,
                        icon: "none",
                    });
                }
            })
    }
    // 调取微信支付
    BridgeReady(res) {
        onBridgeReady(res).then(result => {
            if (result.err_msg == "get_brand_wcpay_request:ok") {
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
    onUsage(type) {
        let { details } = this.state;
        let params = {
            // id: details.id,
            usemust: type == 1 ? details.equity : details.usemust,
            title: type == 1 ? '权益说明' : '使用须知'
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
                            <Text>{details.start_time}&nbsp;-&nbsp;{details.end_time}</Text>
                        </View>
                        <View className="node_detail_explainli" onClick={this.onUsage.bind(this, 1)}>
                            <Text>权益说明</Text>
                            <AtIcon
                                value="chevron-right"
                                size="13"
                                color="#666"
                            />
                        </View>
                        <View className="node_detail_explainli" onClick={this.onHsptl.bind(this, id)}>
                            <Text>可用医院</Text>
                            <AtIcon
                                value="chevron-right"
                                size="13"
                                color="#666"
                            />
                        </View>
                        <View className="node_detail_explainli" onClick={this.onUsage.bind(this, 2)}>
                            <Text>使用须知</Text>
                            <AtIcon
                                value="chevron-right"
                                size="13"
                                color="#666"
                            />
                            <View className={["dot", "dot-left"]}></View>
                            <View className={["dot", "dot-right"]}></View>
                        </View>
                    </View>

                </View>

            </View>
        );
    }
}
