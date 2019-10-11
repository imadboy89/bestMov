import React, {Component} from 'react';
import {Share, Button} from 'react-native';

class ShareBtn extends Component {
    constructor(props) {
        super(props);
      }
  onShare = async () => {
    try {
      const result = await Share.share({
        title:'[bstMov]'+this.props.title,
        message:
          this.props.link,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    return <Button onPress={this.onShare} title="Share" disabled={this.props.disabled} />;
  }
}


export default ShareBtn;