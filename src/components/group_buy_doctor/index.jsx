import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";

import "./index.less";

export default class GroupBuyDoctor extends Component {
  static defaultProps = {
    doctor_list: []
  };

  // 商品详情
  onDetail(id) {
    Taro.removeStorageSync("cid");
    Taro.navigateTo({ url: "/pages/doctor_detail/index?id=" + id });
  }

  render() {
    let { doctor_list } = this.props;
    return (
      <View className="buy_doctors">
        {doctor_list.map(item => {
          return (
            <View
              className="buy_doctor"
              onClick={this.onDetail.bind(this, item.id)}
              key={item.id}
            >
              <Image className="buy_doctor_pict" src={item.pict_url} />
              <View style={{ flex: "1" }}>
                <View className="buy_doctor_name">{item.name}</View>
                <View className="buy_doctor_brief">{item.brief}</View>
                <View className="buy_doctor_center">
                  <Text className="buy_doctor_price">
                    ¥{item.appointment_price}
                  </Text>
                  <Text className="buy_doctor_already">
                    已约{item.number_complete}人
                  </Text>
                </View>
                <View className="buy_doctor_bottom">
                  <View>
                    {item.user.map(user_item => {
                      return (
                        <Image
                          className="buy_doctor_img"
                          src={user_item.portrait}
                          key={user_item.portrait}
                        />
                      );
                    })}
                  </View>
                  <AtButton
                    className="buy_doctor_btn"
                    type="primary"
                    size="small"
                    circle
                  >
                    马上预约
                  </AtButton>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}
