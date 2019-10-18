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
  config = {
    onReachBottomDistance: 50
  };

  state = {
    sort_tab: [
      { title: "自营订单" },
      { title: "团购订单" },
      { title: "礼包订单" }
    ],
    status_tab: [
      { title: "全部" },
      { title: "未支付" },
      { title: "已支付" },
      { title: "已完成" }
    ],
    sort_current: 0,
    status_current: 0,
    page: 0,
    isrequest: true,
    operated_info: [], // 自营订单
    doctor_info: [], // 医生订单
    gift_info: {} // 礼包订单
  };

  componentWillMount() {
    let { sort_current, status_current } = this.$router.params;

    let status_tab = [];
    if (sort_current == 0) {
      status_tab = [
        { title: "全部" },
        { title: "未支付" },
        { title: "已支付" },
        { title: "已完成" }
      ];
    } else if (sort_current == 1 || sort_current == 2) {
      status_tab = [
        { title: "全部" },
        { title: "未支付" },
        { title: "已支付" }
      ];
    }
    this.setState(
      {
        sort_current: sort_current ? parseInt(sort_current) : 0,
        status_current: status_current ? parseInt(status_current) : 0,
        status_tab
      },
      () => {
        Taro.pageScrollTo({ scrollTop: 0 }).then(() => {
          if (this.state.sort_current == 0) this.orderHm();
          else if (this.state.sort_current == 1) this.orderDoctor();
          else if (this.state.sort_current == 2) this.orderGiftBagc();
        });
      }
    );
  }

  // 滑动到底部
  onReachBottom() {
    if (this.state.sort_current == 0) this.orderHm();
    else if (this.state.sort_current == 1) this.orderDoctor();
    else if (this.state.sort_current == 2) this.orderGiftBagc();
  }

  // 切换订单分类
  onSort(sort_current) {
    if (sort_current != this.state.sort_current) {
      let status_tab = [];
      if (sort_current == 0) {
        status_tab = [
          { title: "全部" },
          { title: "未支付" },
          { title: "已支付" },
          { title: "已完成" }
        ];
      } else if (sort_current == 1 || sort_current == 2) {
        status_tab = [
          { title: "全部" },
          { title: "未支付" },
          { title: "已支付" }
        ];
      }
      this.setState(
        {
          sort_current,
          status_tab,
          status_current: 0,
          page: 0,
          isrequest: true,
          operated_info: [],
          doctor_info: []
        },
        () => {
          Taro.pageScrollTo({ scrollTop: 0 }).then(() => {
            if (this.state.sort_current == 0) this.orderHm();
            else if (this.state.sort_current == 1) this.orderDoctor();
            else if (this.state.sort_current == 2) this.orderGiftBagc();
          });
        }
      );
    }
  }

  // 切换订单状态
  onStatus(status_current) {
    if (status_current != this.state.status_current) {
      this.setState(
        {
          status_current,
          page: 0,
          isrequest: true,
          operated_info: [],
          doctor_info: []
        },
        () => {
          Taro.pageScrollTo({ scrollTop: 0 }).then(() => {
            if (this.state.sort_current == 0) this.orderHm();
            else if (this.state.sort_current == 1) this.orderDoctor();
            else if (this.state.sort_current == 2) this.orderGiftBagc();
          });
        }
      );
    }
  }

  onJump() {
    Taro.navigateBack({ delta: 1 });
  }

  onHome() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }

  // 自营支付
  onOperatedPay(order_sn) {
    orderModel
      .orderHmPay({ token: this.props.memberInfo.token, order_sn })
      .then(res => {
        this.BridgeReady(res);
      });
  }

  // 团购支付
  onGroupBuyPay(order_sn) {
    orderModel
      .orderDoctorPay({ token: this.props.memberInfo.token, order_sn })
      .then(res => {
        this.BridgeReady(res);
      });
  }

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
          title: "支付成功,请前往APP查看",
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

  // 自营订单
  orderHm() {
    if (this.state.isrequest) {
      orderModel
        .orderHm({
          status: this.state.status_current,
          token: this.props.memberInfo.token,
          page: this.state.page++
        })
        .then(res => {
          this.setState({ operated_info: this.state.doctor_info.concat(res) });
          if (res.length == 10) this.setState({ isrequest: true });
          else this.setState({ isrequest: false });
        });
    }
  }

  // 团购订单
  orderDoctor() {
    if (this.state.isrequest) {
      orderModel
        .orderDoctor({
          status: this.state.status_current,
          token: this.props.memberInfo.token,
          page: this.state.page++
        })
        .then(res => {
          this.setState({ doctor_info: this.state.doctor_info.concat(res) });
          if (res.length == 10) this.setState({ isrequest: true });
          else this.setState({ isrequest: false });
        });
    }
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

  // 自营订单状态
  // 状态  -1：取消订单  0：代付款  1：已付款  2：完成  3：退款中  4退款成功
  operatedStatus(status) {
    if (status == -1) return "已取消";
    else if (status == 0) return "未支付";
    else if (status == 1) return "已支付";
    else if (status == 2) return "已完成";
    else if (status == 3) return "退款中";
    else if (status == 4) return "退款成功";
  }
  // 团购与礼包订单状态
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
      operated_info,
      doctor_info,
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
            {operated_info.length ? (
              operated_info.map(item => {
                return (
                  <View className="my_order_operated_item" key={item.id}>
                    <View className="my_order_operated_flex">
                      <View className="my_order_operated_hospital">
                        <Image className="hospital_img" src={item.logo} />
                        <Text>{item.name}</Text>
                      </View>
                      <Text style={{ color: "#ff093c" }}>
                        {this.operatedStatus(item.status)}
                      </Text>
                    </View>
                    <View className="my_order_operated_content">
                      <Image
                        className="my_order_operated_img"
                        src={item.pic_url}
                      />
                      <View style={{ flex: "1" }}>
                        <View className="my_order_operated_name">
                          {item.title}
                        </View>
                        <View className="my_order_operated_time">
                          创建日：{item.time}
                        </View>
                        <View className="my_order_operated_time">
                          结束日：{item.settlement_time}
                        </View>
                        <View
                          className="my_order_operated_time"
                          style={{ color: "#f03" }}
                        >
                          预估收益：¥{item.estimated}
                        </View>
                        <View className="my_order_operated_bottom">
                          <Text style={{ color: "#333" }}>
                            {item.appointment_status
                              ? `预约金: ${item.pay_price_my}`
                              : `金额: ${item.pay_price}`}
                          </Text>
                          {item.appointment_status == 1 && (
                            <Text>到院再付: ￥{item.pay_price_tail}</Text>
                          )}

                          <Text>x{item.number}</Text>
                        </View>
                      </View>
                    </View>
                    {item.offline_type != 0 && (
                      <View className="operated_payment_method">
                        付款方式：
                        <Text className="payment_method_text">
                          {item.offline_type == 1 ? "自付" : "机构付"}
                        </Text>
                      </View>
                    )}
                    <View className="my_order_operated_price">
                      共{item.number}件商品 合计：￥
                      <Text className="operated_price">{item.pay_price}</Text>
                    </View>
                    <View className="my_order_operated_btn">
                      {item.status == 1 && item.pay_status == 1 && (
                        <AtButton
                          className="my_order_operated_pay_btn"
                          type="secondary"
                          circle
                        >
                          申请退款
                        </AtButton>
                      )}
                      {item.offline_type == 1 && item.appointment_status == 1 && (
                        <AtButton
                          className="my_order_operated_pay_btn"
                          type="secondary"
                          onClick={this.onOperatedPay.bind(this, item.order_sn)}
                          circle
                        >
                          支付尾款
                        </AtButton>
                      )}
                      {item.status == 0 && !item.pay_status && (
                        <AtButton
                          className="my_order_operated_pay_btn"
                          type="secondary"
                          onClick={this.onOperatedPay.bind(this, item.order_sn)}
                          circle
                        >
                          支付{item.appointment_status ? "预约金" : "全款"}
                        </AtButton>
                      )}
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
          </View>
        )}
        {sort_current == 1 && (
          <View className="my_order_group_buy">
            {doctor_info.length ? (
              doctor_info.map(item => {
                return (
                  <View className="my_order_group_buy_item" key={item.id}>
                    <View className="my_order_group_buy_flex">
                      <Text className="order_numbering">
                        订单编号：{item.order_sn}
                      </Text>
                      <Text style={{ color: "#ff093c" }}>
                        {this.giftStatus(item.status)}
                      </Text>
                    </View>
                    <View className="my_order_group_buy_item_content">
                      <Image
                        className="my_order_group_buy_img"
                        src={item.pict_url}
                      />
                      <View>
                        <View>{item.name}</View>
                        <View className="my_order_group_buy_item20">
                          {item.brief}
                        </View>
                        <View
                          className="my_order_group_buy_item20"
                          style={{ marginTop: "5px" }}
                        >
                          创建日：{item.time}
                        </View>
                      </View>
                    </View>
                    <View className="my_order_group_buy_price">
                      <Text>金额：¥{item.appointment_price}</Text>
                      {!item.status && (
                        <AtButton
                          className="my_order_group_buy_btn"
                          type="secondary"
                          onClick={this.onGroupBuyPay.bind(this, item.order_sn)}
                          circle
                        >
                          去支付
                        </AtButton>
                      )}
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

            {/* <View className="no_order">
              <Image
                className="no_order_img"
                src={image_domain + "w_order.png"}
              />
              <Text>暂无订单～</Text>
            </View> */}
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
