import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtTabBar, AtButton } from "taro-ui";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import { onBridgeReady } from "@/utils/utils";

import "./index.less";



export default class fansOrder extends Component {
    config = {
        onReachBottomDistance: 50
    };

    state = {
        sort_tab: [
            { title: "粉丝" },
            { title: "粉丝订单" }
        ],
        status_tab: [
            { title: "全部" },
            { title: "红粉" },
            { title: "VIP粉丝" },
            { title: "红门管家" }
        ],
        status_sub_tab: [
            { title: "全部" },
            { title: "未支付" },
            { title: "未使用" },
            { title: "已完成" }
        ],
        sort_current: 0,
        status_current: 0,
        status_sub_current: 0,
        page: 0,
        isrequest: true,
    };

    componentWillMount() {
        let { sort_current, status_current } = this.$router.params;

        let status_tab = [];
        let status_sub_tab = [];

        if (sort_current == 0) {
            status_tab = [
                { title: "全部" },
                { title: "红粉" },
                { title: "VIP粉丝" },
                { title: "红门管家" }
            ];
        } else if (sort_current == 1) {
            status_tab = [
                { title: "自营订单" },
                { title: "礼包订单" }
            ];
            status_sub_tab = [
                { title: "全部" },
                { title: "未支付" },
                { title: "未使用" },
                { title: "已完成" }
            ];
        }
        this.setState(
            {
                sort_current: sort_current ? parseInt(sort_current) : 0,
                status_current: status_current ? parseInt(status_current) : 0,
                status_sub_current: 10,
                status_tab
            }
        );
    }

    // 滑动到底部
    onReachBottom() {
        if (this.state.sort_current == 0) this.orderHm();
        else if (this.state.sort_current == 1) this.orderGiftBagc();
    }

    // 切换订单分类
    onSort(sort_current) {
        if (sort_current != this.state.sort_current) {
            let status_tab = [];
            let status_sub_tab = [];
            if (sort_current == 0) {
                status_tab = [
                    { title: "全部" },
                    { title: "红粉" },
                    { title: "VIP粉丝" },
                    { title: "红门管家" }
                ];
            } else if (sort_current == 1) {
                status_tab = [
                    { title: "自营订单" },
                    { title: "礼包订单" }
                ];
                status_sub_tab = [
                    { title: "全部" },
                    { title: "未支付" },
                    { title: "未使用" },
                    { title: "已完成" }
                ];
            }
            this.setState(
                {
                    sort_current,
                    status_tab,
                    status_sub_tab,
                    status_current: 0,
                    status_sub_current: 0,
                    page: 0,
                    isrequest: true,
                    operated_info: [],
                    doctor_info: []
                }
            );
        }
    }

    // 切换订单状态
    onStatus(status_current) {
        if (status_current != this.state.status_current) {
            this.setState(
                {
                    status_current,
                    status_sub_current: 0,
                    page: 0,
                    isrequest: true,
                    operated_info: [],
                    doctor_info: []
                }
            );
        }
    }

    // 切换粉丝订单状态
    onSubStatus(status_sub_current) {
        if (status_sub_current != this.state.status_sub_current) {
            this.setState(
                {
                    status_sub_current,
                    page: 0,
                    isrequest: true,
                    operated_info: [],
                    doctor_info: []
                }
            );
        }
    }

    onJump() {
        Taro.navigateBack({ delta: 1 });
    }

    onHome() {
        Taro.redirectTo({ url: "/pages/home/index" });
    }



    // 自营订单状态
    // 状态  -1：已取消  0：代付款  1：已付款  2：已完成  3：退款中  4退款成功
    operatedStatus(status) {
        if (status == -1) return "已取消";
        else if (status == 0) return "未支付";
        else if (status == 1) return "已支付";
        else if (status == 2) return "已完成";
        else if (status == 3) return "退款中";
        else if (status == 4) return "退款成功";
    }

    // 票券订单状态
    cardStatus(status) {
        if (status) return "已使用";
        else return "待使用";
    }
    // 团购与礼包订单状态
    giftStatus(status) {
        if (status) return "已支付";
        else return "未支付";
    }

    render() {
        let {
            sort_tab,
            sort_current,
            sort_sub_current,
            status_tab,
            status_current,
            status_sub_current,
            status_sub_tab,
        } = this.state;

        return (
            <View className='fans'>
                <View className="fans_navbar">
                    <Navbar color="#666" title="粉丝" onJump={this.onJump.bind(this)} />
                </View>
                <View className='my_order_tab'>
                    <View className='my_order_sort'>
                        <AtTabBar
                            color='#999999'
                            selectedColor='#ffffff'
                            tabList={sort_tab}
                            onClick={this.onSort.bind(this)}
                            current={sort_current}
                        />
                    </View>
                    <View className='my_order_status'>
                        <AtTabBar
                            color='#000000'
                            selectedColor='#ff093c'
                            tabList={status_tab}
                            onClick={this.onStatus.bind(this)}
                            current={status_current}
                        />
                    </View>
                </View>
                {sort_current == 0 && (
                    <View className="gift_order_item">
                        <View className="gitf_item_left">
                            <Image className="gift_item_img" />
                            <View className="gift_item_detail">
                                <View className="gift_detail_title">
                                    <Text className="name">饕餮少女</Text>
                                    <Image className="my_pride_img" src={image_domain + "lever3.png"} />
                                </View>
                                <View className="gift_detail_mobile">18774969356</View>
                                <View className="gift_detail_date">2019-11-27 09:53:23</View>
                            </View>
                        </View>
                        <View className="gift_item_right">
                            <View className="gift_detail_edit">编辑资料</View>
                        </View>
                    </View>
                )}
                {sort_current == 1 && status_current == 0 && (

                    <View className="fans_self_order">
                        <View className='my_order_status'>
                            <AtTabBar
                                color='#000000'
                                selectedColor='#ff093c'
                                tabList={status_sub_tab}
                                onClick={this.onSubStatus.bind(this)}
                                current={status_sub_current}
                            />
                        </View>
                        <View className="fans_order_item">
                            <View className="fans_info">
                                <View className="fans_info_detail">
                                    <View className="fans_detail_img"></View>
                                    <View className="fans_detail_name">饕餮少女</View>
                                    <Image className="fans_detail_pride" src={image_domain + "lever3.png"} />
                                </View>
                                <View className="fans_order_status">待支付</View>
                            </View>
                            <View className="fans_order">
                                <View className="fans_order_img"></View>
                                <View className="fans_order_detail">
                                    <View className="fans_detail_title">【玻尿酸】依婉C 1ml·韩国进口·适合亚洲人的玻尿酸隆鼻/下吧/泪沟/丰唇...</View>
                                    <View className="fans_detail_con">
                                        <View className="fans_detail_date">创建日:2019-11-27 09:53:23</View>
                                        <View className="fans_detail_money">可赚 ¥2000</View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                )}
                {sort_current == 1 && status_current == 1 && (
                    <View className='my_order_gift'>
                    <View className="gift_order_item">
                        <View className="gitf_item_left">
                            <Image className="gift_item_img" />
                            <View className="gift_item_detail">
                                <View className="gift_detail_title">
                                    <Text className="name">饕餮少女</Text>
                                </View>
                                <View className="gift_detail_mobile">18774969356</View>
                                <View className="gift_detail_date">2019-11-27 09:53:23</View>
                            </View>
                        </View>
                        <View className="gift_item_right">
                            <View className="gift_detail_price">+399.00</View>
                            <View className="gift_detail_gift">VIP红粉礼包</View>
                            <View className="gift_detail_return">返现 ¥399</View>
                        </View>
                    </View>
                    </View>
                )}

            </View>
        );
    }
}
