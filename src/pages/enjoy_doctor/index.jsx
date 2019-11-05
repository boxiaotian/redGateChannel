import Taro, { Component } from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import { Navbar, GroupBuyDoctor } from "@/components/index";
import { image_domain } from "@/constants/counter";
import HomeModel from "@/models/home";
import BuyDoctorModel from "@/models/buy_doctors";

import "./index.less";

const homeModel = new HomeModel();
const buyDoctorModel = new BuyDoctorModel();

export default class EnjoyDoctor extends Component {
  config = {
    onReachBottomDistance: 50
  };

  state = {
    carousel_map: [], // 轮播图
    page: 0,
    isrequest: true,
    doctor_list: [] // 商品列表
  };

  componentWillMount() {
    this.rotationChart();
    this.doctorList();
  }

  // 滑动到底部
  onReachBottom() {
    this.doctorList();
  }

  // 返回首页
  onJump() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }

  // 轮播图
  rotationChart() {
    homeModel.rotationChart(4).then(res => {
      this.setState({ carousel_map: res });
    });
  }

  // 团购医生列表
  doctorList() {
    if (this.state.isrequest) {
      let doctor_data = [];
      buyDoctorModel.doctorList(this.state.page++).then(res => {
        res.map(item => {
          let user = [];
          if (item.user.length < 4) {
            user.push(...item.user);
            for (let index = 0; index < 4 - item.user.length; index++) {
              user.push({ portrait: image_domain + "avatar_add.png" });
            }
          } else if (item.user.length > 4) {
            for (let index = 0; index < 4; index++) {
              user.push({ ...item.user[index] });
            }
          }
          doctor_data.push({ ...item, user });
        });
        this.setState({
          doctor_list: this.state.doctor_list.concat(doctor_data)
        });
        if (res.length == 15) this.setState({ isrequest: true });
        else this.setState({ isrequest: false });
      });
    }
  }

  render() {
    let { carousel_map, doctor_list } = this.state;

    return (
      <View className="enjoy_doctor">
        <Navbar title="优享医生" onJump={this.onJump.bind(this)} />
        {carousel_map.length > 0 && (
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
                  <Image className="enjoy_doctor_img" src={item.img} />
                </SwiperItem>
              );
            })}
          </Swiper>
        )}
        <GroupBuyDoctor doctor_list={doctor_list} />
      </View>
    );
  }
}
