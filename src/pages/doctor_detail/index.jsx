import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import {
  View,
  Image,
  Text,
  Swiper,
  SwiperItem,
  RichText,
  ScrollView
} from "@tarojs/components";
import { AtButton, AtCountdown, AtCurtain } from "taro-ui";
import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import BuyDoctorModel from "@/models/buy_doctors";
import WeiXinModel from "@/models/weixin";
import { getMemberInfo } from "@/redux/actions/user";
import { setCahce, getCahce } from "@/utils/cache";
import { getUrlKey, urlEncode, isWeiXin } from "@/utils/utils";

import "./index.less";

const buyDoctorModel = new BuyDoctorModel();
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
export default class DoctorDetail extends Component {
  state = {
    opacity: 0,
    isOpened: false,
    details: {},
    prove: {},
    app_id: ""
  };

  componentWillMount() {
    if (getUrlKey("cid")) setCahce("cid", { cid: getUrlKey("cid") });
    if (this.$router.params.id) this.doctorDetails();
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
          setCahce("url", { url: "doctorDetail?id=" + this.state.details.id });
          if (
            !this.state.details.appointment_type &&
            getCahce("isdoctorPay") &&
            getCahce("isdoctorPay").isPay
          ) {
            Taro.navigateTo({ url: "/pages/doctor_pay/index" });
          } else if (this.state.details.appointment_type) {
            Taro.showToast({
              title: "您已预约，请下载APP查看",
              icon: "none"
            });
          }
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
    Taro.redirectTo({ url: "/pages/enjoy_doctor/index" });
  }

  // 查看资质认证
  onCertificate() {
    buyDoctorModel.doctorDetailsProve(this.details.id).then(res1 => {
      this.setState({ prove: res1 });
    });
    this.setState({
      isOpened: true
    });
  }

  onClose() {
    this.setState({
      isOpened: false
    });
  }

  // 立即预约
  onReservationNow() {
    let { app_id } = this.state;

    if (isWeiXin()) {
      // let redirect_uri = urlEncode("https://hm.hongmenpd.com/wxauth.php");
      let redirect_uri = urlEncode(window.location.href);
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      setCahce("isdoctorPay", { isPay: true });
    } else {
      Taro.showToast({
        title: "请下载APP购买或使用微信打开",
        icon: "none"
      });
    }
  }

  // 医生详情
  doctorDetails() {
    let doctor_data = {};
    buyDoctorModel
      .doctorDetails(this.$router.params.id, this.props.memberInfo.token)
      .then(res => {
        let user = [];
        if (res.user.length < 10) {
          user.push(...res.user);
          for (let index = 0; index < 10 - res.user.length; index++) {
            user.push({ uid: 0, portrait: image_domain + "avatar_add.png" });
          }
        } else if (res.user.length > 10) {
          for (let index = 0; index < 10; index++) {
            user.push({ ...res.user[index] });
          }
        }
        res.user = user;
        doctor_data = res;
        this.setState({ details: doctor_data });
        setCahce("doctorPay", {
          did: doctor_data.id,
          name: doctor_data.name + "医生的预约项目",
          price: doctor_data.appointment_price,
          token: this.props.memberInfo.token,
          source_type_share: getCahce("cid") ? 2 : 1,
          source_type_id: getCahce("cid") ? getCahce("cid").cid : 0
        });
      });
  }

  render() {
    let { opacity, details, isOpened, prove } = this.state;

    return (
      <View className="doctor_details">
        <View className="doctor_details_navbar" style={{ opacity: opacity }}>
          <Navbar title={details.name} onJump={this.onJump.bind(this)} />
        </View>
        {Object.keys(details).length && (
          <Swiper
            circular={details.small_images.length > 1 ? true : false}
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
        <View className="doctor_details_top">
          <View className="doctor_detail_info">
            <Image className="doctor_pict_url" src={details.pict_url} />
            <View>
              <View>
                <Text className="doctor_name">{details.name}</Text>
                <Text style={{ color: "#999999" }}>{details.brief}</Text>
              </View>
              <View style={{ marginTop: "10px", color: "#333333" }}>
                擅长项目：{details.speciality}
              </View>
            </View>
          </View>
          <View
            className="doctor_certificate"
            onClick={this.onCertificate.bind(this)}
          >
            <Image
              className="doctor_certificate_img"
              src={image_domain + "honor.png"}
            />
            <Text>查看医生资质证书</Text>
          </View>
          <View className="appointment_notice">预约须知</View>
        </View>
        <View className="doctor_details_center">
          <View className="doctor_price_group">
            <Text style={{ fontSize: "20px" }}>
              ¥ {details.appointment_price}
            </Text>
            <Text
              style={{ fontWeight: "normal", textDecoration: "line-through" }}
            >
              ¥{details.zk_final_price}
            </Text>
          </View>
          <View className="doctor_end_time">
            <View>距离预约结束还剩</View>
            <AtCountdown
              format={{ day: "天", hours: ":", minutes: ":", seconds: "" }}
              day={details.day}
              hours={details.hours}
              minutes={details.minutes}
              seconds={details.seconds}
              isCard
              isShowDay={details.day ? true : false}
              isShowHour
            />
          </View>
        </View>
        <View className="doctor_details_bottom">
          <View>医生预约，火热进行中...</View>
          <View>
            {details.user &&
              details.user.map(item => {
                return (
                  <Image
                    className="buy_doctor_img"
                    src={item.portrait}
                    key={item.portrait}
                  />
                );
              })}
          </View>
        </View>
        <View className="doctor_detail">
          <RichText nodes={details.details} />
        </View>
        <AtButton
          type="primary"
          onClick={this.onReservationNow.bind(this)}
          disabled={details.appointment_type}
          circle
        >
          {details.appointment_type ? "已预约" : "立即预约"}
        </AtButton>
        <AtCurtain isOpened={isOpened} onClose={this.onClose.bind(this)}>
          <ScrollView scrollY scrollWithAnimation>
            <RichText nodes={prove.prove} />
          </ScrollView>
        </AtCurtain>
      </View>
    );
  }
}
