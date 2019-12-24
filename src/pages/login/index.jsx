import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtInput, AtButton } from "taro-ui";

import { url_domain, image_domain } from "@/constants/counter";
import WeiXinModel from "@/models/weixin";
import { getCahce, setCahce } from "@/utils/cache";
import { isWeiXin } from "@/utils/utils";

import "./index.less";

const weiXinModel = new WeiXinModel();

@connect(store => {
  return { memberInfo: store.user.memberInfo };
})
export default class Login extends Component {
  state = {
    mobile: "", // 手机号
    verification: "", // 验证码
    disabled: false, // 是否发送
    second: 60 // 验证码倒计时
  };

  handleInput(stateName, value) {
    this.setState({
      [stateName]: value
    });
  }

  // 是否倒计时
  showTipText() {
    let { disabled, second } = this.state;
    return disabled ? `${second}s后重试` : "发送验证码";
  }

  // 获取验证码
  onVerification() {
    let { mobile, disabled } = this.state;
    if (disabled) return;
    // 倒计时
    if (!/^[1]([3-9])[0-9]{9}$/.test(mobile)) {
      Taro.showToast({
        title: "手机号格式错误",
        icon: "none"
      });
    } else {
      this.setState({ disabled: true });
      const timer = setInterval(() => {
        if (this.state.second > 0) {
          this.setState({ second: this.state.second - 1 });
        } else {
          this.setState({
            second: 60,
            disabled: false
          });
          clearInterval(timer);
        }
      }, 1000);

      // 发送验证码
      weiXinModel.sendCode(mobile).then(res => {
        Taro.showToast({
          title: "验证码发送成功",
          icon: "none"
        });
      });
    }
  }

  onLoginRegistered(type) {
    let { mobile, verification } = this.state;
    if (!/^[1]([3-9])[0-9]{9}$/.test(mobile)) {
      Taro.showToast({
        title: "手机号格式错误",
        icon: "none"
      });
    } else if (verification == "") {
      Taro.showToast({
        title: "验证码不能为空",
        icon: "none"
      });
    } else {
      let params = {};
      if (type) {
        if (isWeiXin()) {
          let { memberInfo } = this.props;
          params = {
            mobile: mobile,
            code: verification,
            openid: memberInfo.openid,
            unionid: memberInfo.unionid,
            uid: memberInfo.uid,
            from: "weixin"
          };
        } else {
          params = {
            mobile: mobile,
            code: verification,
            from: "H5"
          };
        }
        weiXinModel.codelogin(params).then(res => {
          setCahce("member_info", res);
          window.location.href =
            url_domain + (getCahce("url") ? getCahce("url").url : "home");
          // Taro.redirectTo({
          //   url: getCahce("url")
          //     ? `/pages/${getCahce("url").url}/index`
          //     : "/pages/red_door_package/index"
          // });
        });
      } else {
        if (isWeiXin()) {
          let { memberInfo } = this.props;
          params = {
            mobile: mobile,
            yzm: verification,
            portrait: memberInfo.headimg,
            name: memberInfo.nickname,
            openid: memberInfo.openid,
            unionid: memberInfo.unionid,
            bind_id: memberInfo.bind_id,
            from: "weixin",
            code:
              getCahce("cid") && getCahce("cid").cid
                ? getCahce("cid").cid
                : "HB322085"
          };
        } else {
          params = {
            mobile: mobile,
            yzm: verification,
            from: "H5",
            code:
              getCahce("cid") && getCahce("cid").cid
                ? getCahce("cid").cid
                : "HB322085"
          };
        }
        weiXinModel.register(params).then(res => {
          setCahce("member_info", res);
          window.location.href =
            url_domain + (getCahce("url") ? getCahce("url").url : "home");
          // Taro.redirectTo({
          //   url: getCahce("url")
          //     ? `/pages/${getCahce("url").url}/index`
          //     : "/pages/red_door_package/index"
          // });
        });
      }
    }
  }

  render() {
    let { mobile, verification } = this.state;

    return (
      <View className="login">
        <Image className="login_logo" src={image_domain + "logo1.png"} />
        <AtInput
          title="手机号码"
          placeholder="输入手机号码"
          className="login_mobile"
          name="mobile"
          type="phone"
          onChange={this.handleInput.bind(this, "mobile")}
          value={mobile}
        />
        <AtInput
          title="验证码"
          placeholder="输入验证码"
          className="login_verification"
          name="verification"
          type="number"
          onChange={this.handleInput.bind(this, "verification")}
          value={verification}
        >
          <View className="login_send" onClick={this.onVerification.bind(this)}>
            {this.showTipText()}
          </View>
        </AtInput>
        <AtButton
          className="login_login"
          type="primary"
          onClick={this.onLoginRegistered.bind(this, 1)}
          circle
        >
          登录
        </AtButton>
        <AtButton
          className="login_registered"
          type="secondary"
          onClick={this.onLoginRegistered.bind(this, 0)}
          circle
        >
          注册
        </AtButton>
      </View>
    );
  }
}
