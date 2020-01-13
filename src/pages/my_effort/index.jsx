import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";
import { Navbar } from "@/components/index";

import { image_domain } from "@/constants/counter";

import "./index.less";

export default class MyEffort extends Component {
    state = {};

    // 返回
    onJump() {
        Taro.redirectTo({ url: "/pages/notes/index" });
    }
    render() {
        return (
            <View className="effort">
                <View className="my_navbar">
                    <Navbar color="#666" title="我的收益" onJump={this.onJump.bind(this)} />
                </View>
                <View className="effort_head" >
                    <Image className="effort_head_bg" src={image_domain + "get-banner.png"} />
                    <Text className="effort_all effort_pos" >2800.00</Text>
                    <Text className="effort_name effort_pos" >账户总收益</Text>
                    <View className="effort_detail effort_pos">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_title">可提现金额(元)</View>
                            <View className="effort_detail_num">680.00</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_title">可提现金额(元)</View>
                            <View className="effort_detail_num">680.00</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_title">可提现金额(元)</View>
                            <View className="effort_detail_num">680.00</View>
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
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">680.00</View>
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
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">680.00</View>
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
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">680.00</View>
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
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
                <View className="effort_item">
                    <View className="effort_item_title">
                        <View className="effort_item_left">
                            <Image className="effort_item_icon" src={image_domain + "maneger_get_online.png"} />
                            <Text className="effort_item_name">管理收益(线上)</Text>
                        </View>
                        <Text className="effort_item_click">查看全部</Text>
                    </View>
                    <View className="effort_item_detail">
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">680.00</View>
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
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
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
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">上月收益</View>
                        </View>
                        <View className="effort_detail_item" >
                            <View className="effort_detail_num">680.00</View>
                            <View className="effort_detail_title">本月预估收益</View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}