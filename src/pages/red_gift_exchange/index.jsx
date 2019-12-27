import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtGrid, AtCountdown, AtProgress, AtButton, AtTabBar } from "taro-ui";

import { CustomNavBar } from "@/components/index";
import PackageModel from "@/models/package";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";

import "./index.less";

const packageModel = new PackageModel();
const weiXinModel = new WeiXinModel();

@connect(
  store => {
    return { memberInfo: store.user.memberInfo };
  },
  dispatch => {
    return {
      onGetMemberInfo(params) {
        dispatch(getMemberInfo(params));
      }
    };
  }
)
export default class RedGiftExchange extends Component {
  config = {
    onReachBottomDistance: 50
  };
  state = {
    info: this.props.memberInfo,
    list: [],
    page: 0,
    isspecial: true,
    isoffer: false , // 为true 则是列表还未加载完
    exchange : 0 , // 是否已兑换
  };

  componentWillMount() {
    // if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
    this.getlist();
  }

  // 礼包兑换列表
  getlist() {
    packageModel
      .giftExchangeList({ token: this.state.info.token, page: this.state.page })
      .then(res => {
        console.log("礼包兑换列表", res);
        this.setState({ list: this.state.list.concat(res.list) , exchange : res.exchange });
        if (res.list.length == 10) this.setState({ isoffer: true });
        else this.setState({ isoffer: false });
      });
  }

  // 滑动到底部
  onReachBottom() {
    if (this.state.isoffer) {
      this.setState({
        page: this.state.page + 1
      });
      this.getlist();
    }
  }

  // 返回首页
  onJump() {
    Taro.redirectTo({ url: "/pages/my/index" });
  }

  // x详情
  onPage(item) {
    console.log(item);
    
    Taro.redirectTo({ url: "/pages/red_gift_exchange_detail/index?item=" + JSON.stringify(item)  + "&exchange=" + this.state.exchange });
  }

  render() {
    let { info, list } = this.state;

    return (
      <View className="red_gift_exchange">
        <CustomNavBar
          title="vip礼包兑换权益"
          color="#000"
          onJump={this.onJump.bind(this)}
          style={{  backgroundColor: "#fff" ,color:"#000" }}
        />
        <View className="main">
          {list.map((item, index) => {
            return (
              <View className="listbox">
                <Image mode="aspectFill" className="listimg" src={item.pict_url} />
                <View className="rightmain">
                  <View className="top">
                    <View className="r_left">
                      <View className="listtitle">{item.title}</View>
                      <View className="lsum">已约{item.volume}人 </View>
                    </View>
                    <View className="lexchange" onClick={this.onPage.bind(this,item)} >立即兑换</View>
                  </View>
                  <View className="Qualifications">
                    会员资格 + ￥{item.zk_final_price}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}
