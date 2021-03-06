import Taro, { Component } from "@tarojs/taro";
import "./index.less";
import { View } from "@tarojs/components";
import { AtIcon } from "taro-ui";

export default class CustomNavBar extends Component {
  static defaultProps = {
    title: "",
    color: "#fff"
  };

  // 跳转页面
  onJump() {
    this.props.onJump && this.props.onJump();
  }

  render() {
    let { title, color , style} = this.props;

    return (
      <View className="nav_bar" style={style}>
        <View className="nav_bar_left">
          <AtIcon
            value="chevron-left"
            size="26"
            color={color}
            onClick={this.onJump.bind(this)}
          />
          {this.props.children}
        </View>
        {title}
      </View>
    );
  }
}
