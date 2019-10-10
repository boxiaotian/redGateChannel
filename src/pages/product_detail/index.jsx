import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Swiper, SwiperItem } from "@tarojs/components";
import { AtButton, AtDivider } from "taro-ui";
import { Navbar } from "@/components/index";
import OperatedModel from "@/models/operated_goods";
import { image_domain } from "@/constants/counter";

import "./index.less";

const operatedModel = new OperatedModel();

export default class ProductDetail extends Component {
  state = {
    opacity: 0,
    details: {},
    current: 1 // 轮播图当前下标
  };

  componentWillMount() {
    if (this.$router.params.gid) this.goodsHmDetails();
    else Taro.redirectTo({ url: "/pages/home/index" });
  }

  onPageScroll(obj) {
    if (obj.scrollTop == 0) {
      this.setState({ opacity: 0 });
    } else if (obj.scrollTop > 0 && obj.scrollTop < 22) {
      this.setState({ opacity: 0.25 });
    } else if (obj.scrollTop > 22 && obj.scrollTop < 44) {
      this.setState({ opacity: 0.5 });
    } else if (obj.scrollTop > 44 && obj.scrollTop < 66) {
      this.setState({ opacity: 0.75 });
    } else if (obj.scrollTop > 66) {
      this.setState({ opacity: 1 });
    }
  }

  // 返回首页
  onJump() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }

  // 轮播图
  onSwiper(obj) {
    this.setState({ current: obj.detail.current + 1 });
  }
  // 商品详情
  goodsHmDetails() {
    operatedModel.goodsHmDetails(this.$router.params.gid).then(res => {
      console.log(res);
      this.setState({ details: res });
    });
  }

  render() {
    let { opacity, details, current } = this.state;

    return (
      <View className="product_details">
        <View
          className="product_details_navbar"
          style={{ opacity: opacity, zIndex: 2 }}
        >
          <Navbar title="商品详情" onJump={this.onJump.bind(this)} />
        </View>
        <View style={{ position: "relative" }}>
          {Object.keys(details).length && (
            <Swiper
              className="test-h"
              indicatorColor="rgba(255, 255, 255, 0)"
              indicatorActiveColor="#ff0000"
              onChange={this.onSwiper.bind(this)}
              circular
              indicatorDots
              autoplay
            >
              {details.small_images &&
                details.small_images.map(item => {
                  return (
                    <SwiperItem key={item}>
                      <Image className="product_details_img" src={item} />
                    </SwiperItem>
                  );
                })}
            </Swiper>
          )}
          <View className="product_detail_img_group">
            {current} / {details.small_images && details.small_images.length}
          </View>
        </View>
        <View className="product_details_top">
          <View>
            <Text className="product_after_money">¥{details.after_money}</Text>
            <Text className="product_final_price">
              ¥{details.zk_final_price}
            </Text>
          </View>
          <View className="product_title">{details.title}</View>
          <View className="product_volume">已售 {details.volume}</View>
        </View>
        {details.hospital && (
          <View className="product_details_center">
            <Image
              className="product_hospital_logo"
              src={details.hospital.hospital_logo}
            />
            <View className="product_hospitals">
              <Text className="product_hospital_name">
                {details.hospital.name}
              </Text>
              <Text>资质：{details.hospital.type}</Text>
              <Text>
                地址：
                {details.hospital.province +
                  details.hospital.city +
                  details.hospital.county +
                  details.hospital.address}
              </Text>
            </View>
          </View>
        )}
        <AtDivider
          content="继续拖动，查看图文详情"
          fontColor="#9a9a9a"
          lineColor="#d0d0d0"
          height="40"
          fontSize="24"
        />
        <View className="product_detail">
          {details.details &&
            details.details.map(item => {
              return (
                <Image
                  className="product_detail_img"
                  key={item.value}
                  src={item.value}
                />
              );
            })}
        </View>
        <View className="product_detail_pay">
          <View className="product_detail_pay_left">
            {details.appointment_money_status ? (
              <View>
                <View className="product_appointment_money">
                  预约金：¥
                  <Text className="product_appointment_money_num">
                    {` ${details.appointment_money}`}
                  </Text>
                </View>
                <View className="product_price_reach">
                  到店再付：¥{details.price_reach}
                </View>
              </View>
            ) : (
              <View>
                全款付：¥
                <Text style={{ fontWeight: "bold", color: "#ff0000" }}>
                  {` ${details.price_reach}`}
                </Text>
              </View>
            )}
          </View>
          <AtButton className="pay_btn">立即购买</AtButton>
        </View>
      </View>
    );
  }
}
