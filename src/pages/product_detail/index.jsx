import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Image, Text, Swiper, SwiperItem } from "@tarojs/components";
import { AtButton, AtDivider } from "taro-ui";
import { Navbar } from "@/components/index";
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
export default class ProductDetail extends Component {
  state = {
    app_id: "",
    opacity: 0,
    details: {},
    current: 1 // 轮播图当前下标
  };

  componentWillMount() {
    if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
    if (this.$router.params.gid) this.goodsHmDetails();
    else Taro.redirectTo({ url: "/pages/home/index" });

    // 公众号AppId
    weiXinModel.getConfig().then(res => {
      this.setState({ app_id: res.app_id });
    });

    if (getUrlKey("code")) {
      this.props.onGetMemberInfo &&
        this.props.onGetMemberInfo({ code: getUrlKey("code") });
      if (this.props.memberInfo !== undefined && this.props.memberInfo.uid) {
        setTimeout(() => {
          setCahce("url", {
            url: "productDetail?gid=" + this.state.details.id
          });
          Taro.navigateTo({
            url: "/pages/confirm_order/index?gid=" + this.state.details.id
          });
        }, 1000);
      } else {
        Taro.showToast({
          title: "请登录注册",
          icon: "none",
          success: () => {
            setTimeout(() => {
              Taro.redirectTo({ url: "/pages/login/index" });
            }, 1000);
          }
        });
      }
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
  onPay() {
    let { app_id } = this.state;

    if (isWeiXin()) {
      // let redirect_uri = urlEncode("https://hm.hongmenpd.com/wxauth.php");
      let redirect_uri = urlEncode(window.location.href);
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    } else {
      Taro.showToast({
        title: "请下载APP购买或使用微信打开",
        icon: "none"
      });
    }
  }

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
          {Object.keys(details).length && (
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
                  到院再付：¥{details.price_reach}
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
          <AtButton
            className="pay_btn"
            onClick={this.onPay.bind(this, details.id)}
          >
            立即购买
          </AtButton>
        </View>
      </View>
    );
  }
}
