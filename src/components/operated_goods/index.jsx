import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";

import "./index.less";

export default class OperatedGood extends Component {
  static defaultProps = {
    good_list: []
  };

  // 商品详情
  ondetail(gid) {
    Taro.navigateTo({ url: "/pages/product_detail/index?gid=" + gid });
  }
  render() {
    let { good_list } = this.props;

    return (
      <View className="operated_goods">
        {good_list.map(item => {
          return (
            <View
              className="operated_good"
              onClick={this.ondetail.bind(this, item.id)}
              key={item.id}
            >
              <Image className="operated_good_pict" src={item.pict_url} />
              <View className="operated_good_title">{item.title}</View>
              <View>
                <Text className="operated_good_after_money">
                  ¥ {item.after_money}
                </Text>
                <Text className="operated_good_zk_final_price">
                  ¥{item.zk_final_price}
                </Text>
              </View>
              <View className="operated_good_volume">已售{item.volume}</View>
              <View className="operated_good_discount_money">
                <Text>惠</Text>
                <Text>¥{item.discount_money}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}
