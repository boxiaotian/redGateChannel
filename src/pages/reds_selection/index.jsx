import Taro, { Component } from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import { Navbar, OperatedGood } from "@/components/index";
import HomeModel from "@/models/home";
import OperatedModel from "@/models/operated_goods";

import "./index.less";

const homeModel = new HomeModel();
const operatedModel = new OperatedModel();

export default class RedsSelection extends Component {
  config = {
    onReachBottomDistance: 50
  };

  state = {
    carousel_map: [], // 轮播图
    page: 0,
    isrequest: true,
    good_list: [] // 商品列表
  };

  componentWillMount() {
    this.rotationChart();
    this.hmGoods();
  }

  // 滑动到底部
  onReachBottom() {
    this.hmGoods();
  }

  // 返回首页
  onJump() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }

  // 轮播图
  rotationChart() {
    homeModel.rotationChart(3).then(res => {
      this.setState({ carousel_map: res });
    });
  }

  // 商品列表
  hmGoods() {
    if (this.state.isrequest) {
      operatedModel.hmGoods(this.state.page++).then(res => {
        this.setState({ good_list: this.state.good_list.concat(res) });
        if (res.length == 20) this.setState({ isrequest: true });
        else this.setState({ isrequest: false });
      });
    }
  }

  render() {
    let { carousel_map, good_list } = this.state;

    return (
      <View className="reds_selection">
        <Navbar title="红们精选" onJump={this.onJump.bind(this)} />
        {carousel_map.length && (
          <Swiper
            indicatorColor="rgba(255, 255, 255, 0)"
            indicatorActiveColor="#ff0000"
            circular={carousel_map.length > 1 ? true : false}
            indicatorDots={carousel_map.length > 1 ? true : false}
            autoplay
          >
            {carousel_map.map(item => {
              return (
                <SwiperItem key={item.id}>
                  <Image className="reds_selection_img" src={item.img} />
                </SwiperItem>
              );
            })}
          </Swiper>
        )}
        <OperatedGood good_list={good_list} />
      </View>
    );
  }
}
