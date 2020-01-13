import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtGrid, AtButton, AtProgress } from "taro-ui";
import { Navbar } from "@/components/index";

import { image_domain, my_key } from "@/constants/counter";

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
                <Text className="name">橘子果酱</Text>
                <Image className="my_pride_img" src={image_domain + "lever3.png"} />
              </View>
              <View className="prog_text">本月业绩达到1500000(已完成...</View>
              <AtProgress percent={25} isHidePercent strokeWidth={3} color='#F8B62C'></AtProgress>
              <View className="prog_text">本月业绩达到1500000(已完成...</View>
              <AtProgress percent={25} isHidePercent strokeWidth={3} color='#F8B62C'></AtProgress>
              <View className="code_container">
                <Text className="code">邀请码：HBM62WSZ</Text>
                <AtButton
                  className="note_copy_btn"
                  type="primary"
                  size="small"
                  circle
                >
                  复制
</AtButton>
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
                <View className="num">0.00</View>
                <View>今日收益</View>
              </View>
            </View>
          </View>
        </View>
        <View className="bodyCon">
          <View className="packgift">
            <Image className="vip_img" src={image_domain + "crown-icon.png"}></Image>
            <View className="packgift_title">购买礼包升级VIP享多种特权</View>
            <AtButton
              className="buy_packgift_btn"
              type="primary"
              size="small"
            >
              立即购买
                  </AtButton>
          </View>
          <View className="key">
            <View className="key_item">
              <Image src={image_domain + "effort.png"} className="key_item_img" />
              <View >收益</View>
            </View>
            <View className="key_item">
              <Image src={image_domain + "order.png"} className="key_item_img" />
              <View>订单</View>
            </View>
            <View className="key_item">
              <Image src={image_domain + "follower.png"} className="key_item_img" />
              <View>粉丝</View>
            </View>
            <View className="key_item">
              <Image src={image_domain + "card.png"} className="key_item_img" />
              <View>卡券</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
