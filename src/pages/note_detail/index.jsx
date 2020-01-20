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
export default class NoteDetail extends Component {
    state = {
        details: {},
        info: this.props.memberInfo,
        app_id: "",
        id: this.$router.params.id || getUrlKey("id"),
        type: this.$router.params.type || 3
    };
    componentWillMount() {
        if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
        if (getUrlKey("id")) {
            setCahce("id", { id: getUrlKey("id") })
            console.log(getUrlKey("id"));
            this.setState({ id: getUrlKey("id") })
        };
        console.log(this.props.memberInfo, "111111");
        // 公众号AppId
        weiXinModel.getConfig().then(res => {
            this.setState({ app_id: res.app_id }, () => {
                console.log(this.props.memberInfo, "this.props.memberInfo");
                if (this.props.memberInfo && this.props.memberInfo.token) {
                    this.noteDetail()
                } else {
                    // 未登录 
                    console.log("未登录", getUrlKey("code"));
                    this.getwx()
                }
            });
        });
    }

    componentDidMount() {
        if (this.props.memberInfo && this.props.memberInfo.token) {
            this.noteDetail()
        }
    }

    getwx() {
        if (this.state.app_id) {
            let redirect_uri = urlEncode("http://hm.hongmenpd.com/H5/wxauth.php"); // 开发
            // let redirect_uri = urlEncode(window.location.href); // 正式
            if (!getUrlKey("code")) {
                window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
            } else {
                console.log(getUrlKey("code"), "getUrlKey()");
                console.log("this.props1111", this.props.memberInfo);
                setCahce("url", { url: "noteDetail?cid=" + getUrlKey("cid") + "&id=" + getUrlKey("id") });
                this.props.onGetMemberInfo && this.props.onGetMemberInfo({ code: getUrlKey("code") })
                setTimeout(() => {
                    console.log("kaishi000000", this.props.memberInfo);
                    if (this.props.memberInfo && this.props.memberInfo.token) {
                        weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
                            console.log(res, "res");
                            this.setState({ info: res });
                            this.noteDetail()
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

    //卡券详情
    noteDetail() {
        let note_data = {};
        noteModel
            .noteDetails({ id: this.state.id, token: this.state.info.token, })
            .then(res => {
                note_data = res;
                this.setState({ details: note_data, id: this.state.id });
            });
    }
    // 返回
    onJump() {
        Taro.redirectTo({ url: "/pages/notes/index" });
    }

    onPay() {
        let cid = getCahce("cid");
        // console.log(cid);
        let params = {
            token: this.props.memberInfo.token,
            id: this.state.id,
            source_type_id: this.props.memberInfo.openid
        }
        if (cid) {
            params.cid = cid.cid
        }

        noteModel.cardPay(params)
            .then(res => {
                console.log("res", res);
                this.BridgeReady(res);
            })
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
                    title: "支付失败",
                    icon: "none",
                    success: () => {
                        setTimeout(() => {
                            window.location.href = url_domain + "noteDetail?cid=" + getUrlKey("cid") + "&id=" + getUrlKey("id");
                        }, 1000);
                    }
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
                    {
                       this.state.type == 1 && (
                            <View className="note_detail_exchange">
                                <Text>兑换码：{details.code}</Text>

                                <AtButton
                                    className="note_copy_btn"
                                    type="primary"
                                    size="small"
                                    circle
                                >
                                    复制
                    </AtButton>
                                
                            
        
                    </View>
                    )}
    
                       {/* <View className="note_detail_money">
                     <Text>分享可赚:¥{details.share}</Text>
                     <Text>消费返现:¥{details.purchase}</Text>
                 </View>  */}
                    {
                        this.state.type == 3 && (
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
                        )
                    }
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
