import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { Navbar } from "@/components/index";
import { AtButton } from "taro-ui";
import { getMemberInfo } from "@/redux/actions/user";
import { setCahce, getCahce } from "@/utils/cache";
import NoteModel from "@/models/note";
import { getUrlKey, urlEncode, isWeiXin } from "@/utils/utils";
import { connect } from "@tarojs/redux";

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

export default class index extends Component {
    state = {
        app_id: "",
        info: this.props.memberInfo,
        page: 0,
        note_list: []
    };


    componentWillMount() {
        if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
        // 卡券列表
        noteModel.noteList({  page: this.state.page }).then(res => {

            this.setState({ note_list: this.state.note_list.concat(res.data) });
            
        });
        // 公众号AppId
        weiXinModel.getConfig().then(res => {
            this.setState({ app_id: res.app_id });
        });
        // if (getUrlKey("code")) {
        //     this.props.onGetMemberInfo &&
        //       this.props.onGetMemberInfo({ code: getUrlKey("code") });
        //     if (this.props.memberInfo !== undefined && this.props.memberInfo.uid) {
        //       setTimeout(() => {
        //         setCahce("url", { url: "doctorDetail?id=" + this.state.details.id });
        //         if (
        //           !this.state.details.appointment_type &&
        //           getCahce("isdoctorPay") &&
        //           getCahce("isdoctorPay").isPay
        //         ) {
        //           Taro.navigateTo({ url: "/pages/doctor_pay/index" });
        //         } else if (this.state.details.appointment_type) {
        //           Taro.showToast({
        //             title: "您已预约，请下载APP查看",
        //             icon: "none"
        //           });
        //         }
        //       }, 1000);
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
        //   }

    }
    onJump() {
        Taro.redirectTo({ url: "/pages/home/index" });
    }
     // 卡券详情
     onDetail(id) {
      Taro.navigateTo({ url: "/pages/note_detail/index?id=" + id });
     }
 
    render() {
        let { info, note_list } = this.state;
        {
           
                return (
                    <View className="notes">
                        <View className="note_navbar">
                            <Navbar color="#666" title="票券中心" onJump={this.onJump.bind(this)} />
                        </View>
                        <View className="notes_container">
                        {note_list.map(item => {
                            return (
                             <View className="note"  onClick={this.onDetail.bind(this, item.id)}>

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
                                    <View className="note_detail_buy">
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

                            )}
                        )}



                        </View>


                    </View>
                )
            
}
    }
    }
