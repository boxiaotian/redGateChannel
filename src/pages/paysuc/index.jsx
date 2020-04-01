import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";
import wx from 'weixin-js-sdk'

import { Navbar } from "@/components/index";
import { url_domain, image_domain } from "@/constants/counter";
import PackageModel from "@/models/package";
import WeiXinModel from "@/models/weixin";
import { initShareInfo } from "@/utils/utils";

import "./index.less";

const packageModel = new PackageModel();
const weiXinModel = new WeiXinModel();

@connect(store => {
    return { memberInfo: store.user.memberInfo };
})
export default class RedPowderVip extends Component {
    state = {};
    componentDidMount(){
        this.share();
    }
    componentWillUnmount() {
    }

    onJump() {
        Taro.redirectTo({ url: "/pages/red_door_package/index" });
        // window.location.href = url_domain + "redDoorPackage";
    }
   
    share(){
            let url = location.href.split('#')[0]
            weiXinModel.getWechatConfig(url).then(res => {
                wx.config({
                    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.appId, // 必填，公众号的唯一标识
                    timestamp: res.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.nonceStr, // 必填，生成签名的随机串
                    signature: res.signature,// 必填，签名
                    jsApiList: res.jsApiList // 必填，需要使用的JS接口列表
                  })
                  wx.ready(()=>{
                      initShareInfo(wx,"YHIJ4NUD");
                  })
            });
    }

    onJump(){
        window.location.href = url_domain + "myOrder?sort_current=2";
    }

    render() {
        return (
            <View className="pay_suc">
                <Navbar
                    title="支付成功"
                    color="#000000"
                    onJump={this.onJump.bind(this)}
                />
                <View className="container">
                    <Image className="payicon" src={image_domain + "payicon.png"} />
                    <View className="suctext">
                        <Text >支付成功</Text>
                    </View>
                    <View className="money">
                        <Text >¥399.00</Text>
                    </View>
                    <AtButton  className="btn"  type="primary"   onClick={this.share.bind(this)} circle>快速分享</AtButton>
                    <AtButton  className="btn btn_white" type="primary" onClick={this.onJump.bind(this)} circle>完成</AtButton>
                </View>
            </View>
        );
    }
}
