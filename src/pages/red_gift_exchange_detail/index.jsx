import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Image, Text, Swiper, SwiperItem } from "@tarojs/components";
import { AtButton, AtDivider } from "taro-ui";
import { Navbar } from "@/components";
import OperatedModel from "@/models/operated_goods";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import { setCahce } from "@/utils/cache";
import { getUrlKey, urlEncode, isWeiXin } from "@/utils/utils";

import "./index.less";

const operatedModel = new OperatedModel();
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
export default class RedGifExchangeDetail extends Component {
  state = {
    app_id: "",
    opacity: 0,
    details: {},
    current: 1 // 轮播图当前下标
  };

  componentWillMount() {
    let item = getUrlKey("item");
    if (item) {
      item = JSON.parse(item);
      console.log(item);
      this.setState({
        details: item
      });
    }
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
    // Taro.navigateBack({ delta: 1 });
  }

  // 轮播图
  onSwiper(obj) {
    this.setState({ current: obj.detail.current + 1 });
  }

  // 确认订单
  onPay() {}

  // 商品详情
  goodsHmDetails() {
    operatedModel.goodsHmDetails(this.$router.params.gid).then(res => {
      this.setState({ details: res });
    });
  }

  render() {
    let { opacity, details, current } = this.state;

    return (
      <View className="product_details">
        <View className="product_details_navbar" style={{ opacity: opacity }}>
          <Navbar title="商品详情" onJump={this.onJump.bind(this)} />
        </View>
        <View style={{ position: "relative" }}>
        <Image mode="center" className="product_details_img" src={details.pict_url} />
          {/* {Object.keys(details).length && (
            <Swiper
              indicatorColor="rgba(255, 255, 255, 0)"
              indicatorActiveColor="#ff0000"
              onChange={this.onSwiper.bind(this)}
              circular={details.small_images.length > 1 ? true : false}
              autoplay
              indicatorDots
            >
              {details.small_images &&
                details.small_images.map(item => {
                  return (
                    <SwiperItem key={item}>
                      <Image className="product_details_img" src={item.value} />
                    </SwiperItem>
                  );
                })}
            </Swiper>
          )} */}
          {/* <View className="product_detail_img_group">
            {current} / {details.small_images && details.small_images.length}
          </View> */}
        </View>
        <View className="product_details_top">
          <View>
           <Text className="">礼包价</Text>
            <Text className="product_after_money"> ¥{details.after_money}</Text>
            <Text className="product_final_price">
              ¥{details.zk_final_price}
            </Text>
          </View>
          <View className="product_title">{details.title}</View>
          <View className="product_volume">已售 {details.volume}</View>
        </View>
        <View className="product_detail">
          {details.small_images &&
            details.small_images.map(item => {
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
                  到院再付：¥{details.price_reach}
                </View>
              </View>
            ) : (
              <View>
                <Text>红粉VIP会员资格兑换</Text>
              </View>
            )}
          </View>
          <AtButton
            className="pay_btn"
            onClick={this.onPay.bind(this, details.id)}
          >
            立即兑换
          </AtButton>
        </View>
      </View>
    );
  }
}
