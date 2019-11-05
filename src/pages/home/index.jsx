import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Swiper, SwiperItem } from "@tarojs/components";
import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import HomeModel from "@/models/home";
import WeiXinModel from "@/models/weixin";
import { setCahce } from "@/utils/cache";
import { isWeiXin, isAndroid } from "@/utils/utils";

import "./index.less";

const homeModel = new HomeModel();
const weiXinModel = new WeiXinModel();

export default class Home extends Component {
  config = {
    onReachBottomDistance: 50
  };
  state = {
    app_id: "",
    tab_list: [
      { title: "自营商品" },
      { title: "团购医生" },
      { title: "超级礼包" }
    ],
    tab_current: 0,
    special_page: 0,
    offer_page: 0,
    isspecial: true,
    isoffer: false,
    carousel_map: [], // 轮播图
    special_list: [], // 首页专场
    offer_list: [] // 红们特惠
  };

  componentWillMount() {
    Taro.removeStorageSync("cid");
    // 公众号AppId
    weiXinModel.getConfig().then(res => {
      this.setState({ app_id: res.app_id });
    });
    this.setState(
      {
        special_page: 0,
        offer_page: 0,
        isspecial: true,
        isoffer: false,
        special_list: []
      },
      () => {
        Taro.pageScrollTo({ scrollTop: 0 }).then(() => {
          this.specialField();
        });
      }
    );
    this.rotationChart();
  }

  // 滑动到底部
  onReachBottom() {
    if (this.state.isspecial) this.specialField();
    else if (!this.state.isspecial && this.state.isoffer) {
      this.goodsPreferential();
    }
  }

  onFeatured() {
    Taro.navigateTo({ url: "/pages/reds_selection/index" });
  }

  onDoctors() {
    Taro.navigateTo({ url: "/pages/enjoy_doctor/index" });
  }

  // 专场
  onSpecial(fid) {
    this.state.special_list.map(item => {
      if (fid == item.id) {
        let { background, banner, english_name, name } = item;
        setCahce("special_info", { background, banner, english_name, name });
      }
    });
    Taro.navigateTo({ url: "/pages/special_list/index?fid=" + fid });
  }

  // 商品详情
  ondetail(gid) {
    Taro.navigateTo({ url: "/pages/product_detail/index?gid=" + gid });
  }

  // 我的
  onMy() {
    if (isWeiXin()) {
      Taro.navigateTo({ url: "/pages/my/index?appid=" + this.state.app_id });
      setCahce("appid", { appid: this.state.app_id });
    } else {
      Taro.showToast({
        title: "请下载APP或使用微信打开",
        icon: "none",
        success: () => {
          setTimeout(() => {
            if (isAndroid())
              window.location.href = "https://iiu.xyz/app.php/MjQ";
            else window.location.href = "https://iiu.xyz/app.php/NA";
          }, 1000);
        }
      });
    }
  }

  // 联系客服
  onHelpService() {
    Taro.showToast({
      title: "请下载APP联系客服",
      icon: "none"
    });
    setTimeout(() => {
      if (isAndroid()) {
        window.location.href = "https://iiu.xyz/app.php/MjQ";
      } else {
        window.location.href = "https://iiu.xyz/app.php/NA";
      }
    }, 1000);
  }

  // 轮播图
  rotationChart() {
    homeModel.rotationChart().then(res => {
      this.setState({ carousel_map: res });
    });
  }

  // 首页专场
  specialField() {
    if (this.state.isspecial) {
      homeModel.specialField(this.state.special_page++).then(res => {
        this.setState({ special_list: this.state.special_list.concat(res) });
        if (res.length == 3) {
          console.log("ads");

          this.setState({ isspecial: true, isoffer: false });
        } else {
          this.setState({ isspecial: false, isoffer: true }, () => {
            this.goodsPreferential();
          });
        }
      });
    }
  }

  // 红门特惠
  goodsPreferential() {
    homeModel.goodsPreferential(this.state.offer_page++).then(res => {
      this.setState({ offer_list: this.state.offer_list.concat(res) });
      if (res.length == 10) this.setState({ isoffer: true });
      else this.setState({ isoffer: false });
    });
  }

  render() {
    let { carousel_map, special_list, offer_list } = this.state;

    return (
      <View className="home">
        <Navbar title="首页" />
        {carousel_map.length > 0 && (
          <Swiper
            circular={carousel_map.length > 1 ? true : false}
            indicatorDots={carousel_map.length > 1 ? true : false}
            autoplay
          >
            {carousel_map.map(item => {
              return (
                <SwiperItem key={item.id}>
                  <Image
                    className="home_img"
                    src={item.img}
                    mode="aspectFill"
                  />
                </SwiperItem>
              );
            })}
          </Swiper>
        )}
        {/* <Image
          className="year_member_privilege"
          src={image_domain + "year_member_privilege.png"}
        /> */}
        <View style={{ backgroundColor: "#ffffff" }}>
          <View className="home_column_group">
            <Image
              className="home_column"
              src={image_domain + "reds_selection.png"}
              onClick={this.onFeatured.bind(this)}
            />
            <Image
              className="home_column"
              src={image_domain + "excellent_doctor_group.png"}
              onClick={this.onDoctors.bind(this)}
            />
          </View>
        </View>
        {special_list.map(item => {
          return (
            <View
              className="home_special"
              key={item.id}
              style={{
                backgroundImage: `url(${item.banner})`,
                backgroundSize: "cover"
              }}
            >
              <View
                className={[
                  "home_special_group",
                  item.goods.length < 4 && "home_special_group1"
                ]}
              >
                {item.goods.map(item1 => {
                  return (
                    <View
                      className="home_special_good"
                      onClick={this.ondetail.bind(this, item1.id)}
                      key={item1.id}
                    >
                      <Image
                        className="home_special_good_img"
                        src={item1.pict_url}
                      />
                      <View className="home_special_good_name">
                        {item1.title}
                      </View>
                      <View>¥ {item1.after_money}</View>
                    </View>
                  );
                })}
                {item.goods.length == 4 && (
                  <View
                    className="home_special_open"
                    onClick={this.onSpecial.bind(this, item.id)}
                  />
                )}
              </View>
            </View>
          );
        })}
        {offer_list.map(item => {
          return (
            <View
              className="home_good"
              onClick={this.ondetail.bind(this, item.id)}
              key={item.id}
            >
              <View className="home_good_top">
                <Image className="home_good_img" src={item.pict_url} />
                <View className="home_good_right">
                  <View>
                    <View className="home_good_right_price">
                      <Text className="home_good_price_symbol">¥</Text>
                      <Text className="home_good_price">
                        {item.after_money}
                      </Text>
                    </View>
                    <View className="home_good_original">
                      ￥{item.zk_final_price}
                    </View>
                    <View style={{ fontSize: "12px" }}>已售{item.volume}</View>
                  </View>
                  <View className="home_good_benefit">
                    <Text className="home_good_benefit_text">惠</Text>
                    <Text className="home_good_benefit_num">
                      ¥{item.discount_money}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="home_good_title">{item.title}</View>
            </View>
          );
        })}

        <Image
          className="my"
          src={image_domain + "my.png"}
          onClick={this.onMy.bind(this)}
        />
        <Image
          className="service"
          src={image_domain + "customer_service.png"}
          onClick={this.onHelpService.bind(this)}
        />
      </View>
    );
  }
}
