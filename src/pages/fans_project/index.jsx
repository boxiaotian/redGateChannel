import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Radio, RadioGroup, Label, Picker } from "@tarojs/components";
import { AtTabBar, AtForm, AtButton, AtInput, AtIcon } from "taro-ui";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import { onBridgeReady } from "@/utils/utils";

import "./index.less";



export default class FansProject extends Component {
    state = {
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

    onChange = e => {
        this.setState({
            selectorChecked: this.state.selector[e.detail.value]
        })
    }
    onJump() {
        Taro.navigateBack({ delta: 1 });
    }
    handleChange() {

    }
    onSubmit(event) {
    }
    render() {
        return (
            <View className="fans_Project">
                <View className="fans_navbar">
                    <Navbar color="#666" title='个人项目' onJump={this.onJump.bind(this)}></Navbar>
                </View>
                <View className="fans_con">
                    <AtForm
                        onSubmit={this.onSubmit.bind(this)}
                    >
                        <View className="item_com radio_style">
                            <View className="title">是否做过项目</View>
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
                                title='做过什么项目'
                                type='text'
                                placeholder=''
                                value={"实践活动"}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className='item_com piker_style'>
                            <View className="title">预估消费</View>
                            <View className="picker_con">
                                <Picker mode='selector' className="picker_sub_con" range={this.state.selectors[0]} onChange={this.onChange}>
                                    <View className="picker_detail">
                                        <View className='picker'>
                                            {this.state.selectorChecked[0]}
                                        </View>
                                        <AtIcon value='chevron-down' size='25' color='#666'></AtIcon>
                                    </View>
                                </Picker>

                            </View>
                        </View>
                        <View className='item_com piker_style'>
                            <View className="title">在店年限</View>
                            <View className="picker_con">
                                <Picker mode='selector' className="picker_sub_con" range={this.state.selectors[1]} onChange={this.onChange}>
                                    <View className="picker_detail">
                                        <View className='picker'>
                                            {this.state.selectorChecked[1]}
                                        </View>
                                        <AtIcon value='chevron-down' size='25' color='#666'></AtIcon>
                                    </View>
                                </Picker>

                            </View>
                        </View>
                        <View className='item_com piker_style'>
                            <View className="title">平时在店消费金额</View>
                            <View className="picker_con">
                                <Picker mode='selector' className="picker_sub_con" range={this.state.selectors[0]} onChange={this.onChange}>
                                    <View className="picker_detail">
                                        <View className='picker'>
                                            {this.state.selectorChecked[2]}
                                        </View>
                                        <AtIcon value='chevron-down' size='25' color='#666'></AtIcon>
                                    </View>
                                </Picker>

                            </View>
                        </View>
                        <View className='item_com piker_style'>
                            <View className="title">对店忠诚度</View>
                            <View className="picker_con">
                                <Picker mode='selector' className="picker_sub_con" range={this.state.selectors[2]} onChange={this.onChange}>
                                    <View className="picker_detail">
                                        <View className='picker'>
                                            {this.state.selectorChecked[3]}
                                        </View>
                                        <AtIcon value='chevron-down' size='25' color='#666'></AtIcon>
                                    </View>
                                </Picker>

                            </View>
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='铺垫的项目'
                                type='text'
                                placeholder=''
                                value={"双眼皮（眼综合）"}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className='item_com piker_style'>
                            <View className="title">铺垫的程度</View>
                            <View className="picker_con">
                                <Picker mode='selector' className="picker_sub_con" range={this.state.selectors[2]} onChange={this.onChange}>
                                    <View className="picker_detail">
                                        <View className='picker'>
                                            {this.state.selectorChecked[4]}
                                        </View>
                                        <AtIcon value='chevron-down' size='25' color='#666'></AtIcon>
                                    </View>
                                </Picker>

                            </View>
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='不成交的理由'
                                type='text'
                                placeholder=''
                                value={"价格，过不了分期"}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='预约哪位咨询师'
                                type='text'
                                placeholder=''
                                value={"医生"}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        <View className="item_style">
                            <AtInput
                                name='value'
                                title='预约哪位医生'
                                type='text'
                                placeholder=''
                                value={"王院长"}
                                onChange={this.handleChange.bind(this, 'value1')}
                            />
                        </View>
                        {/* <AtButton formType='submit'>完成</AtButton> */}
                    </AtForm>
                </View>
            </View >
        )
    }
}



