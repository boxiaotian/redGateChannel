import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image ,RichText } from "@tarojs/components";
import { Navbar } from "@/components/index";
import { AtButton } from "taro-ui";
import { AtIcon } from "taro-ui";
import { setCahce, getCahce } from "@/utils/cache";
import "./index.less";

export default class index extends Component {
    //票券详细说明
    state = {
        info: {}
      };
    
      componentWillMount() {
        if (getCahce("noteUsg")) {
          this.setState({ info: getCahce("noteUsg") });
        }
      }
      // 返回
    onJump() {
        // Taro.redirectTo({ url: "/pages/note_detail/index" });
        Taro.navigateBack({
            delta: 1 // 返回上一级页面。
            });
    }
    render() {
        let { info } = this.state;
        return (
            <View className="note_expound">
                <View className="note_navbar">
                    <Navbar color="#666" title={info.title}  onJump={this.onJump.bind(this)}/>
                </View>
                <View className="note_expound_container">
                    <View className="note_expound_title">{info.title}</View>
                    <View className="note_expound_content" > 
                    <RichText className='text' nodes= {info.usemust} />
                    </View>
                </View>


            </View>
        )
    }
}
