import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";
import { Navbar } from "@/components/index";
import EffortModel from "@/models/effort";

import { image_domain } from "@/constants/counter";

import "./index.less";

const effortModel = new EffortModel();
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
export default class MyEffort extends Component {
    state = {
        comprehensive: {},
        formalSelfUpper: {},
        formalSelfLower: {},
        formalGift: {},
        formalDiary: {},
        formalAdministrationUpper: {},
        formalAdministrationLower: {},
        formalPurchase: {},
        formalCard: {},
        info: this.props.memberInfo,
    };
    componentWillMount() {
        this.onEffortInfo();
    }
    onEffortInfo() {
        let effort_data = {};
        effortModel
            .myProfit({
                token: this.state.info.token
            })
            .then(res => {
                effort_data = res.data;
                this.setState({ comprehensive:  effort_data.comprehensive,
                     formalSelfUpper: effort_data.detailed.formalSelfUpper,
                     formalSelfLower: effort_data.detailed.formalSelfLower,
                     formalGift: effort_data.detailed.formalGift,
                     formalDiary: effort_data.detailed.formalDiary,
                     formalAdministrationUpper: effort_data.detailed.formalAdministrationUpper,
                     formalAdministrationLower: effort_data.detailed.formalAdministrationLower,
                     formalPurchase: effort_data.detailed.formalPurchase,
                     formalCard: effort_data.detailed.formalCard});
            });
    }
    // 返回
    onJump() {
        Taro.redirectTo({ url: "/pages/my/index" });
    }
    render() {
        return (
            <View className="effort">
                <View className="my_navbar">
                    <Navbar color="#666" title="我的收益" onJump={this.onJump.bind(this)} />
                </View>
                <View className="effort_head" >
                    <Image className="effort_head_bg" src={image_domain + "get-banner.png"} />
                    <Text className="effort_all effort_pos" >{this.state.comprehensive.profit_cumulative}</Text>
                    <Text className="effort_name effort_pos" >账户总收益</Text>
                    <View className="effort_detail effort_pos">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_title">可提现金额(元)</View>
                            <View className="effort_detail_num">{this.state.comprehensive.remind_money}</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_title">上月合计收益(元)</View>
                            <View className="effort_detail_num">{this.state.comprehensive.last_month_money}</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_title">本月收益预估(元)</View>
                            <View className="effort_detail_num">{this.state.comprehensive.this_month_money}</View>
                        </View>
                    </View>
                </View>
                <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "get_online_self.png"} />
                            <Text className="effort_item_name">自营收益(线上)</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalSelfUpper.last_month}</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalSelfUpper.this_month}</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
                <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "get_offline_self.png"} />
                            <Text className="effort_item_name">自营收益(线下)</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalSelfLower.last_month}</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalSelfLower.this_month}</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
                <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "gift_get.png"} />
                            <Text className="effort_item_name">礼包收益</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalGift.last_month}</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalGift.this_month}</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
                <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "content_get.png"} />
                            <Text className="effort_item_name">内容创作收益</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalDiary.last_month}</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalDiary.this_month}</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
                {/* TODO 接口字段缺失 */}
                {/* <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "maneger_get_online.png"} />
                            <Text className="effort_item_name">管理收益(线上)</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalAdministrationUpper.last_month}</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalAdministrationUpper.this_month}</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
                <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "maneger_get_offline.png"} />
                            <Text className="effort_item_name">管理收益(线下)</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalAdministrationLower.last_month}</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalAdministrationLower.this_month}</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View> */}
                <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "backcash_self.png"} />
                            <Text className="effort_item_name">自购返现</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalPurchase.last_month}</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalPurchase.this_month}</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
                <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "backcash_self.png"} />
                            <Text className="effort_item_name">卡券收益</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalCard.last_month}</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">{this.state.formalCard.this_month}</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}