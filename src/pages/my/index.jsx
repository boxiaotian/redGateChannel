import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtGrid, AtList, AtListItem } from "taro-ui";

import { Navbar } from "@/components/index";
import { order_status } from "@/constants/counter";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import { getCahce, setCahce } from "@/utils/cache";
import { isAndroid, getUrlKey, urlEncode } from "@/utils/utils";

import "./index.less";

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
export default class My extends Component {
  state = {
    info: {},
    my_order_data: order_status
  };

  componentWillMount() {
    if (this.props.memberInfo.uid) {
      weiXinModel.selectUser(this.props.memberInfo.uid).then(res => {
        this.setState({ info: res });
      });
    } else if (getCahce("appid")) {
      let redirect_uri = urlEncode("https://app.hongmenpd.com/wxauth.php");
      // let redirect_uri = urlEncode(window.location.href);
      if (!getUrlKey("code")) {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
          getCahce("appid").appid
        }&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      } else {
        this.props.onGetMemberInfo &&
          this.props.onGetMemberInfo({ code: getUrlKey("code") });
        setCahce("url", { url: "my" });
      }
    }
  }

  onJump() {
    Taro.reLaunch({ url: "/pages/red_door_package/index" });
  }

  onHelpService() {
    Taro.showToast({
      title: "请下载APP联系客服",
      icon: "none"
    });
    setTimeout(() => {
      if (isAndroid()) {
        window.location.href = "https://51gsc.com/app/Fqkr";
      } else {
        window.location.href = "https://51gsc.com/app/6DZx";
      }
    }, 1000);
  }

  render() {
    let { info, my_order_data } = this.state;

    return (
      <View className="my">
        <Navbar title="我的" onJump={this.onJump.bind(this)} />
        <View className="my_content">
          <View className="my_info">
            <Image className="my_info_avatar" src={info.portrait} />
            <Text>{info.name}</Text>
          </View>
          <View className="my_order">
            <View className="my_order_top">
              <Text>我的订单</Text>
              <Text className="my_all_order">查看全部</Text>
            </View>
            <AtGrid data={my_order_data} hasBorder={false} columnNum="4" />
          </View>
        </View>
        <AtList hasBorder={false}>
          <AtListItem
            title="帮助与客服"
            arrow="right"
            onClick={this.onHelpService.bind(this)}
            hasBorder={false}
          />
        </AtList>
      </View>
    );
  }
}
