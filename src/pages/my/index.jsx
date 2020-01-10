import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtInput, AtButton } from "taro-ui";
import { Navbar } from "@/components/index";

import { image_domain } from "@/constants/counter";

import "./index.less";

export default class My extends Component {
  state = {};

  // 返回
  onJump() {
    Taro.redirectTo({ url: "/pages/notes/index" });
  }
  render() {
    return (
      <View className="my">
        <View className="my_navbar">
          <Navbar color="#666" title="我的" onJump={this.onJump.bind(this)} />
        </View>
        <View className="my_content">
          <View className="my_content_detail">
            <View className="my_icon"></View>
            <View className="my_info">
              <View className="my_name">
                <Text>橘子果酱</Text>
                <View className="my_pride">
                  <View className="my_pride_img"></View>
                </View>
              </View>
            </View>
          </View>
          <View className="my_content_money">
            <View className="my_money_up">
              <View className="amount">
                <Text className="balance">余额</Text>
                <Text className="money">399.00</Text>
              </View>
              <View className="settle">
              每月25日结算上月收入
              </View>
            </View>
            <View className="my_money_down">
                <View className="Profit">
                   <View className="num">0.00</View>
                   <View>本月预估</View>
                </View>
                <View className="line"></View>
                <View className="Profit">
                   <View  className="num">0.00</View>
                   <View>今日收益</View>
                </View>
            </View>
          </View>
        </View>
        <View className="bodyCon">
            <View className="packgift"></View>
        </View>
      </View>
    )
  }
}
