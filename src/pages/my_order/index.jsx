import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtTabBar } from "taro-ui";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";

import "./index.less";

export default class MyOrder extends Component {
  state = {
    sort_tab: [
      { title: "自营订单" },
      { title: "团购订单" },
      { title: "礼包订单" }
    ],
    status_tab: [
      { title: "全部" },
      { title: "未支付" },
      { title: "未使用" },
      { title: "已完成" }
    ],
    sort_current: 2,
    status_current: 0
  };

  // 切换订单分类
  onSort(sort_current) {
    this.setState({ sort_current });
  }

  // 切换订单状态
  onStatus(status_current) {
    this.setState({ status_current });
  }

  onJump() {
    Taro.navigateBack({ delta: 1 });
  }

  onHome() {
    Taro.reLaunch({ url: "/pages/red_door_package/index" });
  }

  render() {
    let { sort_tab, sort_current, status_tab, status_current } = this.state;

    return (
      <View className="my_order">
        <Navbar title="我的订单" onJump={this.onJump.bind(this)}>
          <Image
            className="nav_bar_home"
            src={image_domain + "home.png"}
            onClick={this.onHome.bind(this)}
          />
        </Navbar>
        <View className="my_order_tab">
          <View className="my_order_sort">
            <AtTabBar
              color="#ff093c"
              selectedColor="#ffffff"
              tabList={sort_tab}
              onClick={this.onSort.bind(this)}
              current={sort_current}
            />
          </View>
          <View className="my_order_status">
            <AtTabBar
              color="#000000"
              selectedColor="#ff093c"
              tabList={status_tab}
              onClick={this.onStatus.bind(this)}
              current={status_current}
            />
          </View>
        </View>
        {sort_current == 0 && (
          <View className="my_order_operated">
            <View className="my_order_operated_item">自营</View>
          </View>
        )}
        {sort_current == 1 && (
          <View className="my_order_group_buy">
            <View className="my_order_group_buy_item">团购</View>
          </View>
        )}
        {sort_current == 2 && (
          <View className="my_order_gift">
            <View className="my_order_gift_item">礼包</View>
            <View className="my_order_gift_item">礼包</View>
          </View>
        )}
      </View>
    );
  }
}
