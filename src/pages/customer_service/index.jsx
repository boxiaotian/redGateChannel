import Taro, { Component } from "@tarojs/taro";
import { View, Input, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";

import "./index.less";

class CustomerService extends Component {
  state = {
    wxCode: "syh2222"
  };

  // 详情切换
  copyCode() {
    Taro.setClipboardData({
      data: this.state.wxCode,
      success: function (res) {
        Taro.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
  render() {
    let { wxCode } = this.state;
    return (
      <View className="customerService">
        <View className="tips">更多优惠请咨询客服</View>
        <Image src="https://hmpd.hongmenpd.com/uploads/20200401/Fq4jTBu2u95PDxse0RAl9UOp_Gyg.png" />
        <View>
          <Text className="wx-code">微信号：{wxCode}</Text>
          <AtButton className="copy-btn" onClick={this.copyCode.bind(this)}>
            复制
          </AtButton>
        </View>
      </View>
    );
  }
}

export default CustomerService;
