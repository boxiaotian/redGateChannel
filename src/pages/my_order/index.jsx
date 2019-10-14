import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtTabBar, AtButton } from "taro-ui";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import OrderModel from "@/models/order";
import { onBridgeReady } from "@/utils/utils";

import "./index.less";

const orderModel = new OrderModel();

@connect(store => {
  return { memberInfo: store.user.memberInfo };
})
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
    status_current: 0,
    gift_info: {} // 礼包订单
  };

  componentWillMount() {
    let { sort_current } = this.$router.params;

    let status_tab = [];
    if (sort_current == 0 || sort_current == 1) {
      status_tab = [
        { title: "全部" },
        { title: "未支付" },
        { title: "未使用" },
        { title: "已完成" }
      ];
    } else if (sort_current == 2) {
      status_tab = [
        { title: "全部" },
        { title: "未支付" },
        { title: "已支付" }
      ];
    }
    this.setState(
      {
        sort_current: sort_current ? parseInt(sort_current) : 0,
        status_tab
      },
      () => {
        if (this.state.sort_current == 2) this.orderGiftBagc();
      }
    );
  }

  // 切换订单分类
  onSort(sort_current) {
    if (sort_current != this.state.sort_current) {
      let status_tab = [];
      if (sort_current == 0 || sort_current == 1) {
        status_tab = [
          { title: "全部" },
          { title: "未支付" },
          { title: "未使用" },
          { title: "已完成" }
        ];
      } else if (sort_current == 2) {
        status_tab = [
          { title: "全部" },
          { title: "未支付" },
          { title: "已支付" }
        ];
      }
      this.setState({ sort_current, status_tab, status_current: 0 }, () => {
        if (this.state.sort_current == 2) this.orderGiftBagc();
      });
    }
  }

  // 切换订单状态
  onStatus(status_current) {
    if (status_current != this.state.status_current) {
      this.setState({ status_current }, () => {
        if (this.state.sort_current == 2) this.orderGiftBagc();
      });
    }
  }

  onJump() {
    Taro.navigateBack({ delta: 1 });
  }

  onHome(e) {
    Taro.redirectTo({ url: "/pages/red_door_package/index" });
  }

  // 团购支付
  onGroupBuyPay() {}

  // 礼包支付
  onGiftPay(order_sn) {
    orderModel
      .orderGiftBagcPay({
        token: this.props.memberInfo.token,
        order_sn
      })
      .then(res => {
        this.BridgeReady(res);
      });
  }

  // 调取微信支付
  BridgeReady(res) {
    onBridgeReady(res).then(result => {
      if (result.err_msg == "get_brand_wcpay_request:ok") {
        Taro.showToast({
          title: "支付成功,请前往APP使用",
          icon: "none"
        });
      } else {
        Taro.showToast({
          title: "支付失败",
          icon: "none"
        });
      }
    });
  }

  // 礼包订单
  orderGiftBagc() {
    orderModel
      .orderGiftBagc({
        status: this.state.status_current,
        token: this.props.memberInfo.token
      })
      .then(res => {
        this.setState({ gift_info: res });
      });
  }

  // 礼包订单状态
  giftStatus(status) {
    if (status) return "已支付";
    else return "未支付";
  }

  render() {
    let {
      sort_tab,
      sort_current,
      status_tab,
      status_current,
      gift_info
    } = this.state;

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
            <View className="my_order_operated_item">
              <View className="no_order">
                <Image
                  className="no_order_img"
                  src={image_domain + "w_order.png"}
                />
                <Text>暂无订单～</Text>
              </View>
            </View>
          </View>
        )}
        {sort_current == 1 && (
          <View className="my_order_group_buy">
            {/* <View className="my_order_group_buy_item">
              <View className="my_order_group_buy_flex">
                <Text className="order_numbering">
                  订单编号：2mitzcsh0mzhdn9na1000010017
                </Text>
                <Text style={{ color: "#ff093c" }}>未支付</Text>
              </View>
              <View className="my_order_group_buy_item_content">
                <Image
                  className="my_order_group_buy_img"
                  src={image_domain + "logo.png"}
                />
                <View>
                  <View>礼包名称</View>
                  <View className="my_order_group_buy_item20">
                    欧洲著名整形医师抗衰老专家
                  </View>
                  <View className="my_order_group_buy_item20">
                    创建日：04-30 17:32
                  </View>
                  <View>定金：￥3000.00</View>
                </View>
              </View>
              <View className="my_order_group_buy_price">
                <Text>金额：¥3000.00</Text>
                <AtButton
                  className="my_order_group_buy_btn"
                  type="secondary"
                  onClick={this.onGroupBuyPay.bind(this)}
                  circle
                >
                  去支付
                </AtButton>
              </View>
            </View> */}
            <View className="my_order_group_buy_item">
              <View className="no_order">
                <Image
                  className="no_order_img"
                  src={image_domain + "w_order.png"}
                />
                <Text>暂无订单～</Text>
              </View>
            </View>
          </View>
        )}
        {sort_current == 2 && (
          <View className="my_order_gift">
            {(gift_info.giftBage && gift_info.giftBage[0].length) ||
            (gift_info.giftBageLarge && gift_info.giftBageLarge.length) ? (
              gift_info.giftBage.map(item => {
                return (
                  <View className="my_order_gift_item" key={item.id}>
                    <View className="my_order_gift_flex">
                      <Text>订单编号: {item.order_sn}</Text>
                      <Text style={{ color: "#ff093c" }}>
                        {this.giftStatus(item.status)}
                      </Text>
                    </View>
                    <View className="my_order_gift_flex">
                      <View className="my_order_gift_content">
                        <View>{item.gname}</View>
                        <View className="my_order_gift20">
                          {item.shortname}
                        </View>
                      </View>
                      <Text>¥{item.price}</Text>
                    </View>
                    <View className="my_order_gift_flex">
                      <Text className="my_order_gift20">
                        创建日：{item.time}
                      </Text>
                      <View className="my_order_gift_price">
                        <Text>金额：￥{item.price}</Text>
                        {item.status == 0 && (
                          <AtButton
                            className="my_order_gift_btn"
                            type="secondary"
                            onClick={this.onGiftPay.bind(this, item.order_sn)}
                            circle
                          >
                            去支付
                          </AtButton>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className="no_order">
                <Image
                  className="no_order_img"
                  src={image_domain + "w_order.png"}
                />
                <Text>暂无订单～</Text>
              </View>
            )}
            {gift_info.giftBageLarge && gift_info.giftBageLarge.length
              ? gift_info.giftBageLarge.map(item => {
                  return (
                    <View className="my_order_gift_item" key={item.id}>
                      <View className="my_order_gift_flex">
                        <Text>订单编号: {item.order_sn}</Text>
                        <Text style={{ color: "#ff093c" }}>
                          {this.giftStatus(item.status)}
                        </Text>
                      </View>
                      <View className="my_order_gift_flex">
                        <View className="my_order_gift_content">
                          <View>{item.gname}</View>
                          <View className="my_order_gift20">
                            {item.shortname}
                          </View>
                        </View>
                        <Text>¥{item.price}</Text>
                      </View>
                      <View className="my_order_gift_flex">
                        <Text className="my_order_gift20">
                          创建日：{item.time}
                        </Text>
                        <View className="my_order_gift_price">
                          <Text>金额：￥{item.price}</Text>
                          {item.status == 0 && (
                            <AtButton
                              className="my_order_gift_btn"
                              type="secondary"
                              onClick={this.onGiftPay.bind(this, item.order_sn)}
                              circle
                            >
                              去支付
                            </AtButton>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        )}
      </View>
    );
  }
}
