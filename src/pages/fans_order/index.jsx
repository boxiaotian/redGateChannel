import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtTabBar, AtButton } from "taro-ui";
import { connect } from "@tarojs/redux";

import { Navbar } from "@/components/index";
import { image_domain } from "@/constants/counter";
import { onBridgeReady } from "@/utils/utils";
import FansModel from "@/models/fans";

import "./index.less";

const fansModel = new FansModel();
@connect(
    store => {
        return { memberInfo: store.user.memberInfo };
    },
    dispatch => {
        return {
            onGetMemberInfo(params) {
                dispatch(getMemberInfo(params));
            }
        };
    }
)
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
        info: this.props.memberInfo,
        fansList: [],
        fansOrderList: [],
        fansGiftOrderList: []
    };

    componentWillMount() {
        let sort_current = this.$router.params.sort_current || 0;
        let status_current = this.$router.params.status_current || 0;
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
        this.onFansList()
    }
    //我的粉丝
    onFansList() {
        fansModel
            .fansList({
                token: this.state.info.token,
                page: this.state.page++,
                status: this.state.status_current,
            })
            .then(res => {
                this.setState({ fansList: res });
            });
    }
    //我的粉丝订单
    onFansOrderList() {
        fansModel
            .fansOrderList({
                token: this.state.info.token,
                page: this.state.page++,
                status: this.state.status_sub_current,
            })
            .then(res => {
                this.setState({ fansOrderList: res });
            });
    }
    //我的粉丝礼包订单
    onFansGiftOrderList() {
        fansModel
            .fansGiftOrderList({
                token: this.state.info.token,
                page: this.state.page++
            })
            .then(res => {
                this.setState({ fansGiftOrderList: res });
            });
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
                this.onFansList()
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
                this.onFansOrderList()
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
                }, () => {
                    if (this.state.sort_current == 0) {
                        this.onFansList();
                    } else if (this.state.sort_current == 1 && status_current == 0) {
                        // 粉丝订单-自营订单
                        this.onFansOrderList();
                    } else if (this.state.sort_current == 1 && status_current == 1) {
                        // 粉丝订单-礼包订单
                        this.onFansGiftOrderList();
                    }
                }
            );
        }
    }

    // 切换粉丝订单状态
    onSubStatus(status_sub_current) {
        console.log("gggg")
        if (status_sub_current != this.state.status_sub_current) {
            this.setState(
                {
                    status_sub_current,
                    page: 0,
                    isrequest: true,
                    operated_info: [],
                    doctor_info: []
                }, () => {
                    if (this.state.sort_current == 1 && this.state.status_current == 0) {
                        this.onFansOrderList();
                    }
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

   
    // 团购与礼包订单状态
    giftStatus(status) {
        if (status) return "已支付";
        else return "未支付";
    }
    onFansEdit(id) {
        Taro.navigateTo({ url: "/pages/fans_edit/index?id=" + id });
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
            fansList,
            fansOrderList,
            fansGiftOrderList
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
                    fansList.map(item => {
                        return (
                            <View className="gift_order_item">
                                <View className="gitf_item_left">
                                    <Image className="gift_item_img" src={item.portrait} />
                                    <View className="gift_item_detail">
                                        <View className="gift_detail_title">
                                            <Text className="name">{item.name}</Text>
                                            {item.grade_id == 0 && (
                                                <Image className="my_pride_img" src={image_domain + "lever1.png"} />
                                            )
                                            }
                                            {item.grade_id == 1 && (
                                                <Image className="my_pride_img" src={image_domain + "lever2.png"} />
                                            )
                                            }
                                            {item.grade_id == 2 && (
                                                <Image className="my_pride_img" src={image_domain + "lever3.png"} />
                                            )
                                            }
                                            {item.grade_id == 3 && (
                                                <Image className="my_pride_img" src={image_domain + "lever4.png"} />
                                            )
                                            }
                                        </View>
                                        <View className="gift_detail_mobile">{item.mobile}</View>
                                        <View className="gift_detail_date">{item.creation_time}</View>
                                    </View>
                                </View>
                                <View className="gift_item_right">
                                    {/* <View className="gift_detail_edit" onClick={this.onFansEdit.bind(this, item.id)}>编辑资料</View> */}
                                    {/* {item.grade_id == 1 && item.vip == 0 ? (
                                        <TouchableOpacity
                                            onPress={() => this.giveGift(item.id)}
                                            style={styles.boxzs}>
                                            <Text style={styles.boxtxtzs}>赠送vip礼包</Text>
                                        </TouchableOpacity>
                                    ) : null} */}
                                </View>
                            </View>
                        )
                    }))

                }
                {sort_current == 1 && status_current == 0 && (
                    fansOrderList.map(item => {
                        return (
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
                                            <View className="fans_detail_img">
                                                <Image className="gift_item_img" src={item.portrait} />
                                            </View>
                                            <View className="fans_detail_name">{item.name}</View>
                                            <Image className="fans_detail_pride" src={image_domain + "lever3.png"} />
                                        </View>
                                        <View className="fans_order_status">{this.operatedStatus(item.status)}</View>
                                    </View>
                                    <View className="fans_order">
                                        <View className="fans_order_img">
                                            <Image className="gift_item_img" src={item.picture} />
                                        </View>
                                        <View className="fans_order_detail">
                                            <View className="fans_detail_title">{item.title}</View>
                                            <View className="fans_detail_con">
                                                <View className="fans_detail_date">创建日:{item.time}</View>
                                                <View className="fans_detail_money">可赚￥{item.money}</View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        )
                    }))

                }
                {sort_current == 1 && status_current == 1 && (
                    fansGiftOrderList.map(item => {
                        return (
                            <View className='my_order_gift'>
                                <View className="gift_order_item">
                                    <View className="gitf_item_left">
                                        <Image className="gift_item_img" src={item.portrait}/>
                                        <View className="gift_item_detail">
                                            <View className="gift_detail_title">
                                                <Text className="name">{item.name}</Text>
                                            </View>
                                            <View className="gift_detail_mobile">{item.mobile}</View>
                                            <View className="gift_detail_date">{item.time}</View>
                                        </View>
                                    </View>
                                    <View className="gift_item_right">
                                        <View className="gift_detail_price">+{item.order_money}</View>
                                        <View className="gift_detail_gift">{item.title}</View>
                                        <View className="gift_detail_return">返现￥{item.money}</View>
                                    </View>
                                </View>
                            </View>
                        )
                    }))

                }

            </View>
        );
    }
}
