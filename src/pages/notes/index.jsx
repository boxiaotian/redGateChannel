import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Navbar } from "@/components/index";
import { AtButton, AtTabs, AtTabsPane } from "taro-ui";
import { getMemberInfo } from "@/redux/actions/user";
import { setCahce, getCahce } from "@/utils/cache";
import NoteModel from "@/models/note";
import { getUrlKey, urlEncode, isWeiXin } from "@/utils/utils";
import { connect } from "@tarojs/redux";
import { redirect_uri } from "@/constants/global"

import WeiXinModel from "@/models/weixin";
import "./index.less";

const noteModel = new NoteModel();
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

export default class Notes extends Component {
    config = {
        onReachBottomDistance: 50
    };

    state = {
        app_id: "",
        info: this.props.memberInfo,
        page: 0,
        isoffer: false,
        note_list: [],
        current: 0, //顶部标签栏
    };


    componentWillMount() {
        if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
        // 公众号AppId
        weiXinModel.getConfig().then(res => {
            this.setState({ app_id: res.app_id }, () => {
                if (!this.props.memberInfo.token) {
                    if (this.state.app_id) {
                        if (!getUrlKey("code")) {
                            window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.state.app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
                        } else {
                            setCahce("url", { url: "notes" });
                            this.props.onGetMemberInfo &&
                                this.props.onGetMemberInfo({ code: getUrlKey("code") });
                            setTimeout(() => {
                                if (this.props.memberInfo && this.props.memberInfo.token) {
                                    this.getList();
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
                    // 卡券列表
                    this.getList();
                }
            });
        });


        // 公众号AppId
        weiXinModel.getConfig().then(res => {
            this.setState({ app_id: res.app_id });

        });

    }
    getList(status) {
        noteModel.noteList({ page: this.state.page, status, token: this.props.memberInfo.token, }).then(res => {

            this.setState({ note_list: res.data });
            if (res.data.length == 10) this.setState({ isoffer: true });
            else this.setState({ isoffer: false });
        });
    }
    onJump() {
        Taro.navigateBack({
            delta: 1 // 返回上一级页面。
        });
    }
    // 滑动到底部
    onReachBottom() {
        if (this.state.isoffer) {
            this.setState({
                page: this.state.page + 1
            });
            this.getList(this.state.current);
        }
    }
    // 卡券详情
    onDetail(id, type) {
        Taro.navigateTo({ url: "/pages/note_detail/index?id=" + id + "&type=" + type });
    }
    //顶部标签栏切换
    handleClick(value) {
        this.setState({
            current: value
        })
        this.getList(value)
    }

    render() {
        const tabList = [{ title: '已购买' }, { title: '已完成' }]
        let { info, note_list } = this.state;
        {

            return (
                <View className="notes">
                    <View className="note_navbar">
                        <Navbar color="#666" title="票券中心" onJump={this.onJump.bind(this)} />
                    </View>
                    <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
                        <AtTabsPane current={this.state.current} index={0} >
                            <View className="notes_container">
                                {note_list.map(item => {
                                    return (
                                        <View className="note">

                                            <View className="note_img">
                                                <Image
                                                    mode="aspectFill"
                                                    className="note_img"
                                                    src={item.image}
                                                />
                                                <View className={["dot", "dot-top"]}></View>
                                                <View className={["dot", "dot-bottom"]}></View>
                                            </View>
                                            <View className={["note_detail", this.state.current == 1&&("bgDis")]}>
                                                <View className="note_detail_price">
                                                    <Text>¥{item.price}</Text>
                                                </View>
                                                <View className="note_detail_useage">
                                                    <Text>{item.title}项目使用</Text>
                                                </View>
                                                <View className="note_detail_hosptl">
                                                    <Text>指定医院通用</Text>
                                                </View>
                                                <View className="note_detail_money">
                                                    <View className="note_text">分享可赚:¥{item.share}</View>
                                                    <View className="note_text">消费返现:¥{item.purchase}</View>
                                                </View>
                                                {
                                                    this.state.current == 0 && (
                                                        <View className="note_detail_buy"  onClick={this.onDetail.bind(this, item.card_id, 1)}>
                                                            <AtButton
                                                                className="note_buy_btn"
                                                                type="primary"
                                                                size="small"
                                                                circle
                                                            >
                                                                立即使用
                                                     </AtButton>
                                                        </View>
                                                    )
                                                }
                                                {
                                                    this.state.current == 1 && (
                                                        <View className="note_detail_buy">
                                                            <AtButton
                                                                className="note_buy_btn"
                                                                type="primary"
                                                                size="small"
                                                                circle
                                                                disabled
                                                            >
                                                                已使用
                                                             </AtButton>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        </View>

                                    )
                                }
                                )}



                            </View>
                        </AtTabsPane>
                        <AtTabsPane current={this.state.current} index={1}>
                            <View className="notes_container">
                                {note_list.map(item => {
                                    return (
                                        <View className="note">

                                            <View className="note_img">
                                                <Image
                                                    mode="aspectFill"
                                                    className="note_img"
                                                    src={item.image}
                                                />
                                                <View className={["dot", "dot-top"]}></View>
                                                <View className={["dot", "dot-bottom"]}></View>
                                            </View>
                                            <View className="note_detail">
                                                <View className="note_detail_price">
                                                    <Text>¥{item.price}</Text>
                                                </View>
                                                <View className="note_detail_useage">
                                                    <Text>{item.title}项目使用</Text>
                                                </View>
                                                <View className="note_detail_hosptl">
                                                    <Text>指定医院通用</Text>
                                                </View>
                                                <View className="note_detail_money">
                                                    <View className="note_text">分享可赚:¥{item.share}</View>
                                                    <View className="note_text">消费返现:¥{item.purchase}</View>
                                                </View>
                                                <View className="note_detail_buy"  onClick={this.onDetail.bind(this, item.id, 3)}>
                                                    <AtButton
                                                        className="note_buy_btn"
                                                        type="primary"
                                                        size="small"
                                                        circle
                                                    >
                                                        立即购买
                                                   </AtButton>
                                                </View>
                                            </View>
                                        </View>

                                    )
                                }
                                )}



                            </View>
                        </AtTabsPane>
                    </AtTabs>



                </View>
            )

        }
    }
}
