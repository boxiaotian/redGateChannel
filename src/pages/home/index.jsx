import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtTabs, AtTabsPane } from "taro-ui";
import { Navbar, OperatedGood, GroupBuyDoctor } from "@/components/index";
import { image_domain } from "@/constants/counter";
import { setCahce } from "@/utils/cache";
import { isWeiXin, isAndroid } from "@/utils/utils";

import "./index.less";
import OperatedModel from "@/models/operated_goods";
import BuyDoctorModel from "@/models/buy_doctors";
import WeiXinModel from "@/models/weixin";

const operatedModel = new OperatedModel();
const buyDoctorModel = new BuyDoctorModel();
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
    page: 0,
    isrequest: true,
    good_list: [], // 自营商品列表
    doctor_list: [] // 团购医生列表
  };

  componentWillMount() {
    // 公众号AppId
    weiXinModel.getConfig().then(res => {
      this.setState({ app_id: res.app_id });
    });
    if (this.state.tab_current == 0) this.hmGoods();
    else if (this.state.tab_current == 1) this.doctorList();
  }

  // 滑动到底部
  onReachBottom() {
    if (this.state.tab_current == 0) this.hmGoods();
    else if (this.state.tab_current == 1) this.doctorList();
  }

  onTabs(current) {
    if (this.state.tab_current != current) {
      this.setState(
        {
          tab_current: current == 2 ? 0 : current,
          page: 0,
          isrequest: true,
          good_list: []
        },
        () => {
          Taro.pageScrollTo({ scrollTop: 0 }).then(() => {
            if (this.state.tab_current == 0) this.hmGoods();
            else if (this.state.tab_current == 1) this.doctorList();
          });
        }
      );
    }
    if (current == 2) {
      Taro.navigateTo({ url: "/pages/red_door_package/index" });
    }
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
              window.location.href = "https://iiu.xyz.com/app.php/MjQ";
            else window.location.href = "https://iiu.xyz.com/app.php/NA";
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
        window.location.href = "https://iiu.xyz.com/app.php/MjQ";
      } else {
        window.location.href = "https://iiu.xyz.com/app.php/NA";
      }
    }, 1000);
  }

  // 自营商品列表
  hmGoods() {
    if (this.state.isrequest)
      operatedModel.hmGoods(this.state.page++).then(res => {
        this.setState({ good_list: this.state.good_list.concat(res) });
        if (res.length == 20) this.setState({ isrequest: true });
        else this.setState({ isrequest: false });
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
    let { tab_list, tab_current, good_list, doctor_list } = this.state;

    return (
      <View className="home">
        <Navbar title="首页" />
        <AtTabs
          current={tab_current}
          tabList={tab_list}
          swipeable={false}
          animated={false}
          onClick={this.onTabs.bind(this)}
        >
          <AtTabsPane current={tab_current} index={0}>
            <Image
              className="year_member_privilege"
              src={image_domain + "year_member_privilege.png"}
            />
          </AtTabsPane>
          <AtTabsPane current={tab_current} index={1}>
            <Image
              className="year_member_privilege"
              src={image_domain + "year_member_privilege.png"}
            />
          </AtTabsPane>
          <AtTabsPane current={tab_current} index={2}>
            <Image
              className="year_member_privilege"
              src={image_domain + "year_member_privilege.png"}
            />
          </AtTabsPane>
        </AtTabs>
        {tab_current == 0 && <OperatedGood good_list={good_list} />}
        {tab_current == 1 && <GroupBuyDoctor doctor_list={doctor_list} />}
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
