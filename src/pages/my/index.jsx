

import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtGrid, AtButton, AtProgress } from "taro-ui";
import { Navbar } from "@/components/index";
import UserMessageModel from "@/models/user_message";
import { image_domain, my_key } from "@/constants/counter";

import "./index.less";

const userMessageModel = new UserMessageModel();
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
export default class My extends Component {
  state = {
    user_info: {},
    progressBar: {},
    info: this.props.memberInfo,
  };
  componentWillMount() {
    this.onUserInfo();
  }
  //我的信息
  onUserInfo() {
    let user_data = {};
    userMessageModel
      .userInfo({
        token: this.state.info.token
      })
      .then(res => {
        user_data = res;
        this.setState({ user_info: user_data });
      });
    userMessageModel
      .progressBar({
        token: this.state.info.token
      })
      .then(res => {
        console.log(res, "ff");

        this.setState({ progressBar: res });
      });
  }
  //复制邀请码
  copyCode() {
    if (this.state.lever === 0) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    Taro.setClipboardData({
      data: this.state.user_info.code,
      success(res) {
        Taro.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
    // Taro.setClipboardData(this.state.user_info.code).then(
    //   Taro.showToast({
    //     title: '已复制邀请码',
    //     icon: 'none'
    //   })
    // )

  }
  // 返回
  onJump() {
    Taro.redirectTo({ url: "/pages/home/index" });
  }
  //收益
  onMyEffort() {
    Taro.navigateTo({ url: "/pages/my_effort/index" });
  }
  //订单
  onMyOrder() {
    Taro.navigateTo({ url: "/pages/my_order/index" });
  }
  //粉丝
  onFansEdit() {
    Taro.navigateTo({ url: "/pages/fans_order/index" });
  }
  //卡券
  onNotes() {
    Taro.navigateTo({ url: "/pages/notes/index" });
  }
  render() {
    let { user_info, progressBar } = this.state;
    return (
      <View className="my">
        <View className="my_navbar">
          <Navbar color="#666" title="我的" onJump={this.onJump.bind(this)} />
        </View>
        <View className="my_content">
          <View className="my_content_detail">
            <View>
              <Image
                className="my_icon"
                src={user_info.portrait}
              />
            </View>
            <View className="my_info">
              <View className="my_name">
                <Text className="name">{user_info.name}</Text>
                {user_info.grade_id == 0 && (
                  <Image className="my_pride_img" src={image_domain + "lever1.png"} />
                )
                }
                {user_info.grade_id == 1 && (
                  <Image className="my_pride_img" src={image_domain + "lever2.png"} />
                )
                }
                {user_info.grade_id == 2 && (
                  <Image className="my_pride_img" src={image_domain + "lever3.png"} />
                )
                }
                {user_info.grade_id == 3 && (
                  <Image className="my_pride_img" src={image_domain + "lever4.png"} />
                )
                }
              </View>
              {/* <View className="prog_text">本月业绩达到</View>
              <AtProgress percent={25} isHidePercent strokeWidth={3} color='#F8B62C'></AtProgress> */}
              {user_info.grade_id == 0 && (
                <View>
                  <View className="prog_text">购买VIP资格礼包</View>
                  <AtProgress percent={progressBar.number / progressBar.total * 100} isHidePercent strokeWidth={3} color='#F8B62C'></AtProgress>
                </View>
              )
              }
              {user_info.grade_id == 1 && (
                <View>
                  <View className="prog_text">拥有{progressBar.total}个VIP粉丝升级({progressBar.number}/{progressBar.total})</View>
                  <AtProgress percent={progressBar.number / progressBar.total * 100} isHidePercent strokeWidth={3} color='#F8B62C'></AtProgress>
                </View>
              )
              }
              {user_info.grade_id == 2 && (
                <View>
                  <View className="prog_text">团队再开发{progressBar.fens.fens_total - progressBar.fens.fens}个非红粉会员（{progressBar.fens.fens}/{progressBar.fens.fens_total}）</View>
                  <AtProgress percent={progressBar.fens.fens / progressBar.fens.fens_total * 100} isHidePercent strokeWidth={3} color='#F8B62C'></AtProgress>
                </View>
              )
              }
              {user_info.grade_id == 3 && (
                <View>
                  {/* <View className="prog_text">本月业绩达到{this.state.total / 10000}w元(已完成{this.state.number / 10000})w元</View>
                  <AtProgress percent={progressBar.money / progressBar.money_total * 100} isHidePercent strokeWidth={3} color='#F8B62C'></AtProgress> */}
                </View>
              )
              }

              {
                user_info.upper_shelf === 1 ?
                  null :

                  <View>
                    {
                      user_info.vip && user_info.vip === 1 ?
                        <View className="code_container">
                          <Text className="code">邀请码：{user_info.code}</Text>
                          <AtButton
                            onClick={this.copyCode.bind(this)}
                            className="note_copy_btn"
                          >
                            复制
                           </AtButton>
                        </View>
                        :
                        null
                    }
                  </View>

              }
            </View>

          </View>
          <View className="my_content_money">
            <View className="my_money_up">
              <View className="amount">
                <Text className="balance">余额</Text>
                <Text className="money">{user_info.balance}</Text>
              </View>
              <View className="settle">
                每月25日结算上月收入
              </View>
            </View>
            <View className="my_money_down" onClick={this.onMyEffort.bind(this)}>
              <View className="Profit">
                <View className="num">{user_info.estimate}</View>
                <View>本月预估</View>
              </View>
              <View className="line"></View>
              <View className="Profit">
                <View className="num">{user_info.profit}</View>
                <View>今日收益</View>
              </View>
            </View>
          </View>
        </View>
        <View className="bodyCon">
          <View className="packgift">
            <Image className="vip_img" src={image_domain + "crown-icon.png"}></Image>
            <View className="packgift_title">购买礼包升级VIP享多种特权</View>
            <AtButton
              className="buy_packgift_btn"
              type="primary"
              size="small"
            >
              立即购买
                  </AtButton>
          </View>
          <View className="key">
            <View className="key_item" onClick={this.onMyEffort.bind(this)}>
              <Image src={image_domain + "effort.png"} className="key_item_img" />
              <View >收益</View>
            </View>
            <View className="key_item" onClick={this.onMyOrder.bind(this)}>
              <Image src={image_domain + "order.png"} className="key_item_img" />
              <View>订单</View>
            </View>
            <View className="key_item" onClick={this.onFansEdit.bind(this)}>
              <Image src={image_domain + "follower.png"} className="key_item_img" />
              <View>粉丝</View>
            </View>
            <View className="key_item" onClick={this.onNotes.bind(this)}>
              <Image src={image_domain + "card.png"} className="key_item_img" />
              <View>卡券</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}