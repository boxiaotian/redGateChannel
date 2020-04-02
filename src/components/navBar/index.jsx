import Taro, { Component } from "@tarojs/taro";
import "./index.less";
import { View } from "@tarojs/components";
import { AtIcon, AtSearchBar } from "taro-ui";

export default class Navbar extends Component {
  static defaultProps = {
    title: "",
    color: "#fff",
    searchText: "搜一下",
    searchValue: '',
  };

  // 跳转页面
  onJump() {
    this.props.onJump && this.props.onJump();
  }
  onChange() {
    this.props.onChange && this.props.onChange();
  }
  onActionClick() {
    this.props.onActionClick && this.props.onActionClick();
  }
 

  render() {
    let { title, color, searchText, searchValue,bgColor } = this.props;

    return (
      <View className="nav_bar">
        <View className="nav_bar_left">
          <AtIcon
            value="chevron-left"
            size="26"
            color={color}
            onClick={this.onJump.bind(this)}
          />
          {this.props.children}
        </View>
        {/* <View className="nav_bar_search">
          <AtSearchBar
            actionName={searchText}
            value={searchValue}
            onChange={this.onChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
          />
        </View> */}
        {title}
      </View>
    );
  }
}
