import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton, AtInputNumber, AtInput } from "taro-ui";
import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import OperatedModel from "@/models/operated_goods";
import { getCahce, setCahce } from "@/utils/cache";

import "./index.less";

const operatedModel = new OperatedModel();

@connect(store => {
  return { memberInfo: store.user.memberInfo };
})
export default class ConfirmOrder extends Component {
  state = {
    info: {},
    good_number: 1,
    remark: ""
  };

  componentWillMount() {
    if (this.$router.params.gid) this.ordersConfirmation();
    else Taro.redirectTo({ url: "/pages/home/index" });
  }

  // 返回上一页
  onJump() {
    Taro.redirectTo({
      url: "/pages/product_detail/index?gid=" + this.$router.params.gid
    });
  }

  // 返回首页
  onHome() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }

  // 改变数量
  onNumber(index, good_number) {
    this.setState({
      good_number: index ? good_number : good_number.detail.value
    });
  }

  handleInput(stateName, value) {
    this.setState({
      [stateName]: value
    });
  }

  onPay() {
    let { info, good_number, remark } = this.state;
    let params = {
      id: info.id,
      title: info.title,
      number: good_number,
      mobile: info.mobile,
      remarks: remark,
      price: info.appointment_money_status
        ? info.appointment_money * good_number
        : (info.after_money - info.appointment_money).toFixed(2) * good_number,
      source_type_share: getCahce("cid") && getCahce("cid").cid ? 2 : 1
    };
    setCahce("commodityPay", params);
    Taro.navigateTo({ url: "/pages/commodity_pay/index" });
  }

  // 商品详情
  ordersConfirmation() {
    operatedModel
      .ordersConfirmation(this.$router.params.gid, this.props.memberInfo.token)
      .then(res => {
        console.log(res);
        this.setState({ info: res });
      });
  }

  render() {
    let { info, good_number, remark } = this.state;

    return (
      <View className="confirm_order">
        <Navbar title="确认订单" onJump={this.onJump.bind(this)}>
          <Image
            className="nav_bar_home"
            src={image_domain + "home.png"}
            onClick={this.onHome.bind(this)}
          />
        </Navbar>
        <View className="confirm_order_info">
          <Image className="confirm_order_info_img" src={info.pict_url} />
          <View className="confirm_order_info_content">
            <View className="confirm_order_info_title">{info.title}</View>
            <View className="confirm_order_info_after_money">
              <Text>¥ {info.after_money}</Text>
              <AtInputNumber
                type="number"
                min={1}
                value={good_number}
                onChange={this.onNumber.bind(this, 1)}
                onBlur={this.onNumber.bind(this, 0)}
              />
            </View>
          </View>
        </View>
        <View className="confirm_order_phone">
          <Text>手机号：</Text>
          <Text>{info.mobile}</Text>
        </View>
        <View className="confirm_order_remarks">
          <Text>备注：</Text>
          <AtInput
            placeholder="选填，请先和机构协商一致"
            name="remark"
            onChange={this.handleInput.bind(this, "remark")}
            value={remark}
            border={false}
          />
        </View>
        <View className="confirm_order_prompt">
          *未满18周岁的手术人需在监护人陪同下到院面诊
        </View>
        <View className="product_detail_pay">
          <View className="product_detail_pay_left">
            {info.appointment_money_status ? (
              <View>
                <View className="product_appointment_money">
                  预约金：¥
                  <Text className="product_appointment_money_num">
                    {` ${info.appointment_money * good_number}`}
                  </Text>
                </View>
                <View className="product_price_reach">
                  到院再付：¥
                  {(info.after_money - info.appointment_money).toFixed(2) *
                    good_number}
                </View>
              </View>
            ) : (
              <View>
                全款付：¥
                <Text style={{ fontWeight: "bold", color: "#ff0000" }}>
                  {` ${info.after_money * good_number}`}
                </Text>
              </View>
            )}
          </View>
          <AtButton className="pay_btn" onClick={this.onPay.bind(this)}>
            立即购买
          </AtButton>
        </View>
      </View>
    );
  }
}
