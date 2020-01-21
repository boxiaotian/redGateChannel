import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";
import { Navbar } from "@/components/index";

import { image_domain } from "@/constants/counter";

import "./index.less";

export default class SelfsupportEffort extends Component {
    state = {};

    // 返回
    onJump() {
        Taro.redirectTo({ url: "/pages/notes/index" });
    }
    render() {
        return (
            <View className="self_effort">
                <View className="my_navbar">
                    <Navbar color="#666" title="自营收益(线上)" onJump={this.onJump.bind(this)} />
                </View>
                <View className="effort_head">
                    <View>2019年11月</View>
                    <View>收益合计 ¥ 3920.00</View>
                </View>
                <View className="effort_list">
                    <View className="effort_item">
                        <View className="effort_img"></View>
                        <View className="effort_detail">
                            <View className="effort_detail_title">进口陶瓷自锁托槽隐形矫正 牙...</View>
                            <View className="effort_detail_mobile">18774969356</View>
                            <View className="effort_detail_date">核销时间：2019-11-27 09:53:23</View>
                        </View>
                        <View className="effort_money">+2750.00</View>
                    </View>
                    <View className="effort_item">
                        <View className="effort_img"></View>
                        <View className="effort_detail">
                            <View className="effort_detail_title">进口陶瓷自锁托槽隐形矫正 牙...</View>
                            <View className="effort_detail_mobile">18774969356</View>
                            <View className="effort_detail_date">核销时间：2019-11-27 09:53:23</View>
                        </View>
                        <View className="effort_money">+2750.00</View>
                    </View>
                    <View className="effort_item">
                        <View className="effort_img"></View>
                        <View className="effort_detail">
                            <View className="effort_detail_title">进口陶瓷自锁托槽隐形矫正 牙...</View>
                            <View className="effort_detail_mobile">18774969356</View>
                            <View className="effort_detail_date">核销时间：2019-11-27 09:53:23</View>
                        </View>
                        <View className="effort_money">+2750.00</View>
                    </View>
                    <View className="effort_item">
                        <View className="effort_img"></View>
                        <View className="effort_detail">
                            <View className="effort_detail_title">进口陶瓷自锁托槽隐形矫正 牙...</View>
                            <View className="effort_detail_mobile">18774969356</View>
                            <View className="effort_detail_date">核销时间：2019-11-27 09:53:23</View>
                        </View>
                        <View className="effort_money">+2750.00</View>
                    </View>
                </View>
            </View>
        )
    }
}