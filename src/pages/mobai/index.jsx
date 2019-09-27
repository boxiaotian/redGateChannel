import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtInput, AtButton } from "taro-ui";

import { image_domain } from "@/constants/counter";

import "./index.less";

export default class RedDoorPackage extends Component {
  state = {};

  render() {
    return <View className="red_door_package">红门礼包</View>;
  }
}
