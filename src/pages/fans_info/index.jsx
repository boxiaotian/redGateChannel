import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Radio, RadioGroup, Label, Picker } from "@tarojs/components";
import { AtTabBar, AtForm, AtButton, AtInput, AtIcon, AtImagePicker } from "taro-ui";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import { onBridgeReady } from "@/utils/utils";

import "./index.less";



export default class FansInfo extends Component {
    state = {
        files: [{
            url: 'https://jimczj.gitee.io/lazyrepay/aragaki1.jpeg',
          }],
        info: [],
        checked: 0,
        list: [
            {
                value: '1',
                text: '是',
                checked: false
            },
            {
                value: '0',
                text: '否',
                checked: true
            }
        ],
        selectors: [
            [
                '0k-1k',
                '1k-5k',
                '5k-10k',
                '10k-20k',
                '20k-50k',
                '50k-100k',
                '100k-150k',
                '150k-200k',
                '200k-250k',
                '250k-300k',
                '300k-500k',
            ],
            ['半年内', '一年', '两年内', '三年内', '五年内', '十年内'],
            ['高', '中', '低']
        ],
        selectorChecked: [
            '0k-1k',
            '半年内',
            '0k-1k',
            '高',
            '高'
        ]
    }
    onChangePho (files) {
        this.setState({
          files
        })
      }
    onChange = e => {
        this.setState({
            selectorChecked: this.state.selector[e.detail.value]
        })
    }
    onJump() {
        Taro.navigateBack({ delta: 1 });
    }
     //下一步个人资产
      //个人资产
    onFansMeans() {
        Taro.navigateTo({ url: "/pages/fans_means/index" });
    }
     onFansMeans() {
        Taro.navigateTo({ url: "/pages/fans_means/index" });
    }
    handleChange() {

    }
    onSubmit(event) {
    }
    render() {
        return (
            <View className="fans_Project">
                <View className="fans_navbar">
                    <Navbar color="#666" title='个人信息' onJump={this.onJump.bind(this)}></Navbar>
                </View>
                <View className="fans_con">
                    <AtForm
                        onSubmit={this.onSubmit.bind(this)}
                    >

                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='姓名'
                                type='text'
                                placeholder='请输入姓名'
                                value={""}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='美容店店名'
                                type='text'
                                placeholder='请输入店名'
                                value={""}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className="item_com radio_style">
                            <View className="title">是否有陪同人</View>
                            <RadioGroup>
                                {this.state.list.map((item, i) => {
                                    return (
                                        <Label className="radio_item" for={i} key={i}>
                                            <Radio style='margin-left: 20rpx' value={item.value} checked={item.checked}>{item.text}</Radio>
                                        </Label>
                                    )
                                })}
                            </RadioGroup>
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='年龄'
                                type='text'
                                placeholder='请输入年龄'
                                value={""}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='职业'
                                type='text'
                                placeholder='请输入职业'
                                value={""}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className="item_com radio_style">
                            <View className="title">婚姻</View>
                            <RadioGroup>
                                {this.state.list.map((item, i) => {
                                    return (
                                        <Label className="radio_item" for={i} key={i}>
                                            <Radio style='margin-left: 20rpx' value={item.value} checked={item.checked}>{item.text}</Radio>
                                        </Label>
                                    )
                                })}
                            </RadioGroup>
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='家庭成员'
                                type='text'
                                placeholder='请输入家庭成员'
                                value={""}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='兴趣爱好'
                                type='text'
                                placeholder='请输入兴趣爱好'
                                value={""}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className="item_com radio_style">
                            <View className="title">顾客是否有病史</View>
                            <RadioGroup>
                                {this.state.list.map((item, i) => {
                                    return (
                                        <Label className="radio_item" for={i} key={i}>
                                            <Radio style='margin-left: 20rpx' value={item.value} checked={item.checked}>{item.text}</Radio>
                                        </Label>
                                    )
                                })}
                            </RadioGroup>
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='身体健康状况'
                                type='text'
                                placeholder='请输入身体健康状况'
                                value={""}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        {/* TODO 图片上传 */}
                        {/* <View className="cus_info">
                            <AtImagePicker
                                files={this.state.files}
                                onChange={this.onChangePho.bind(this)}
                            />
                        </View> */}
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='推荐人姓名'
                                type='text'
                                placeholder='请输入请输入推荐人'
                                value={""}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <AtButton formType='submit' className="submitBtn" onClick={this.onFansMeans.bind(this)}>下一步</AtButton>
                    </AtForm>
                </View>
            </View >
        )
    }
}



