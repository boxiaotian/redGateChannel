import Taro, { Component } from "@tarojs/taro";
import {
    View,
    Image,
    Text,
    ScrollView
} from "@tarojs/components";
import { Navbar } from "@/components/index";
import NoteModel from "@/models/note";
import { connect } from "@tarojs/redux";
import { getMemberInfo } from "@/redux/actions/user";
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

export default class NoteHsptl extends Component {
    state = {
        app_id: "",
        info: this.props.memberInfo,
        search: "",
        type: 1,
        page: 0,
        hsptl_list: []
    };
    componentWillMount() {
        if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
        if (this.$router.params.id) this.hsptlList();
        else Taro.redirectTo({ url: "/pages/home/index" });
        // 公众号AppId
        weiXinModel.getConfig().then(res => {
            this.setState({ app_id: res.app_id });
        });

    }
    hsptlList() {
        noteModel.hsptlList({  token: this.state.info.token,page: this.state.page, search: this.state.search,type: this.state.type,id: this.$router.params.id }).then(res => {

            this.setState({ hsptl_list: this.state.hsptl_list.concat(res.data) });

        });
    }
    // 返回
    onJump() {
        // Taro.redirectTo({ url: "/pages/note_detail/index" });
        Taro.navigateBack({
            delta: 1 // 返回上一级页面。
        });
    }

    render() {
        let { hsptl_list } = this.state;
        return (
            <View className="note_hsptl">
                <View className="note_navbar">
                    <Navbar color="#666" title="医院列表" onJump={this.onJump.bind(this)} />
                </View>
                <View className="note_hsptl_container">
                    {hsptl_list.map(item => {
                        return (
                            <View className="note_hsptl_content">
                                <View >
                                <Image
                                        mode="aspectFill"
                                        className="hsptl_img"
                                        src={item.logo}
                                    />
                                </View>
                                <View className="hsptl_name">{item.name}</View>
                            </View>
                        )
                    })}
                </View>
            </View>

        )
    }
}