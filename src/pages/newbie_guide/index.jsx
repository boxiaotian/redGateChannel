import Taro, { Component } from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import RichTextModel from "@/models/rich_text";
import BuyDoctorModel from "@/models/buy_doctors";

import "./index.less";

const richTextModel = new RichTextModel();
const buyDoctorModel = new BuyDoctorModel();

export default class NewbieGuide extends Component {
  state = {
    newbie_guide: ""
  };

  componentWillMount() {
    let { sid, nid } = this.$router.params;
    if (sid == 1) {
      richTextModel.noviceGuideDetails(nid).then(res => {
        this.setState({ newbie_guide: res.details });
      });
    } else if (sid == 2) {
      buyDoctorModel.doctorDetailsProve(nid).then(res => {
        this.setState({ newbie_guide: res.prove });
      });
    } else if (sid == 3) {
      richTextModel.certificate(nid).then(res => {
        this.setState({ newbie_guide: res.details });
      });
    } else if (sid == 4) {
      buyDoctorModel.doctorDetails(nid, "").then(res => {
        this.setState({ newbie_guide: res.details });
      });
    }
  }
  render() {
    let { newbie_guide } = this.state;
    return (
      <View className="newbie_guide">
        <RichText nodes={newbie_guide} />
      </View>
    );
  }
}
