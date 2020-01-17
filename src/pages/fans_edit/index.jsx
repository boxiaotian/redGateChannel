import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtTabBar, AtButton, AtIcon } from "taro-ui";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import { onBridgeReady } from "@/utils/utils";

import "./index.less";



export default class FansEdit extends Component {
    onJump() {
        Taro.navigateBack({ delta: 1 });
    }

    render() {
        return (
            <View className="fans_edit">
                <View className="fans_navbar">
                    <Navbar color="#666" title='编辑资料' onJump={this.onJump.bind(this)}></Navbar>
                </View>
                <View className="fans_edit_item">
                    <Text>个人信息</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>
                <View className="fans_edit_item">
                    <Text>个人信息</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>
                <View className="fans_edit_item">
                    <Text>个人信息</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>
                <View className="fans_edit_item">
                    <Text>个人信息</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>
                <View className="fans_edit_item">
                    <Text>个人信息</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>


            </View>
        )
    }
}