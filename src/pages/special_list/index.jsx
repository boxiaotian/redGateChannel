import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { Navbar, OperatedGood } from "@/components/index";
import HomeModel from "@/models/home";
import { getCahce } from "@/utils/cache";

import "./index.less";

const homeModel = new HomeModel();

export default class SpecialList extends Component {
  config = {
    onReachBottomDistance: 50
  };

  state = {
    special_height: 0,
    page: 0,
    isrequest: true,
    special_info: {},
    special_list: [] // 专场商品列表
  };

  componentWillMount() {
    Taro.getSystemInfo().then(res => {
      this.setState({
        special_height: res.windowHeight - 44 - 200
      });
    });
    this.setState({ special_info: getCahce("special_info") });
    if (this.$router.params.fid) {
      this.specialFieldGoods();
    } else {
      Taro.redirectTo({ url: "/pages/home/index" });
    }
  }

  // 滑动到底部
  onReachBottom() {
    this.specialFieldGoods();
  }

  // 返回首页
  onJump() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }

  // 专场商品列表
  specialFieldGoods() {
    if (this.state.isrequest) {
      homeModel
        .specialFieldGoods(this.state.page++, this.$router.params.fid)
        .then(res => {
          this.setState({
            special_list: this.state.special_list.concat(res)
          });
          if (res.length == 10) this.setState({ isrequest: true });
          else this.setState({ isrequest: false });
        });
    }
  }

  render() {
    let { special_height, special_info, special_list } = this.state;

    return (
      <View className="special_list">
        <Navbar title={special_info.name} onJump={this.onJump.bind(this)} />
        <Image className="special_logo" src={special_info.banner} />
        <View
          className="special_list_group"
          style={{ minHeight: special_height + "px" }}
        >
          <View className="special_list_name">{special_info.name}</View>
          <View className="special_list_name_en">
            {special_info.english_name}
          </View>
          <OperatedGood good_list={special_list} />
        </View>
      </View>
    );
  }
}
