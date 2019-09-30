import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";

import "./index.less";

export default class Privilege extends Component {
  state = {
    privilege: [0, 1, 2, 3, 4, 5, 6]
  };

  componentDidMount() {
    if (this.$router.params.id) {
      Taro.createSelectorQuery()
        .select("#privilege" + this.$router.params.id)
        .boundingClientRect(rect => {
          Taro.pageScrollTo({ scrollTop: rect.top });
        })
        .exec();
    }
  }

  onJump() {
    Taro.redirectTo({ url: "/pages/red_door_package/index" });
  }

  render() {
    let { privilege } = this.state;

    return (
      <View className="privilege">
        <Navbar
          title="六大权益"
          color="#000000"
          onJump={this.onJump.bind(this)}
        />
        {privilege.map(item => {
          return (
            <Image
              key={item}
              id={"privilege" + item}
              src={`${image_domain}privilege${item}.png`}
            />
          );
        })}
      </View>
    );
  }
}
