import Taro, { Component } from "@tarojs/taro";
import { View, Input, Text, Image } from "@tarojs/components";
import OperatedModel from "@/models/operated_goods";
import { AtButton } from "taro-ui";
import { url_domain } from "@/constants/counter";

import "./index.less";

const operatedModel = new OperatedModel();
class CustomerService extends Component {
  state = {
    kefuInfo: {},
    wxCode: ''
  };
 componentDidMount(){
  operatedModel.isToWeixin('hm_product_kefu_config').then(res => {
    let wxCode = (res.wechat_username.length>6)? res.wechat_username.substring(0, 6).concat("..."):res.wechat_username
    this.setState({wxCode})
      this.setState({kefuInfo: res})
    })
 }

  // 详情切换
  copyCode() {
    Taro.setClipboardData({
      data: this.state.kefuInfo.wechat_username,
      success: function (res) {
        Taro.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }
  onJump(){
    window.location.href = url_domain + "myOrder?sort_current=0"
  }
  render() {
    let { kefuInfo, wxCode } = this.state;
    return (
      <View className="customerService">
        <View className="tips">长按咨询客服</View>
        <Image src={kefuInfo.wechat_qrcode} />
        <View className="wx-code-copy">
          <Text className="wx-code">微信号：{wxCode}</Text>
          <AtButton className="copy-btn" onClick={this.copyCode.bind(this)}>
            复制
          </AtButton>
        </View>
        <AtButton className="pre-back" onClick={this.onJump.bind(this)}>
            返回
        </AtButton>
      </View>

    );
  }
}

export default CustomerService;
