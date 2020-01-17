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
    //个人信息
    onFansInfo() {
        Taro.navigateTo({ url: "/pages/fans_info/index" });
    }
    //个人资产
    onFansMeans() {
        Taro.navigateTo({ url: "/pages/fans_means/index" });
    }
    //个人项目
    onFansProject() {
        Taro.navigateTo({ url: "/pages/fans_project/index" });
    }

    render() {
        return (
            <View className="fans_edit">
                <View className="fans_navbar">
                    <Navbar color="#666" title='编辑资料' onJump={this.onJump.bind(this)}></Navbar>
                </View>
                <View className="fans_edit_item" onClick={this.onFansInfo.bind(this)}>
                    <Text>个人信息</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>
                <View className="fans_edit_item" onClick={this.onFansMeans.bind(this)}>
                    <Text>个人资产</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>
                <View className="fans_edit_item" onClick={this.onFansProject.bind(this)}>
                    <Text>个人项目</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>
                <View className="fans_edit_item" >
                    <Text>选择医院</Text>
                    <AtIcon
                        value="chevron-right"
                        size="13"
                        color="#666"
                    />
                </View>
                <View className="fans_edit_item" >
                    <Text>咨询记录</Text>
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