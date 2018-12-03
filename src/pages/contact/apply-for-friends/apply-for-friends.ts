import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalData} from "../../../providers/GlobalData";
import {CommonService} from "../../../service/CommonService";
import {EasemobChatService} from "../../../providers/EasemobChatService";
import {ChatMessage} from "../../../model/home/contact/chat-message/ChatMessage";
import {Utils} from "../../../providers/Utils";

/**
 * 申请好友页面
 */

@IonicPage()
@Component({
  selector: 'page-apply-for-friends',
  templateUrl: 'apply-for-friends.html',
})
export class ApplyForFriendsPage {
  item: any = {};
  in_VerificationInfo = "我是xxx";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public globalData: GlobalData,
              private eoChatService: EasemobChatService,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyForFriendsPage');
    this.item = this.navParams.get("ITEM");
    this.in_VerificationInfo = "我是" + this.globalData.user.USER005;
  }

  //申请加好友按钮
  applyFriendButton() {
    this.globalData.showLoading = false;
    this.commonService.getPage("/cts/addApplyRecord", {
      USER001: this.globalData.userId,
      APPL003: this.item.USER001,
      APPL005: 0,
      APPLMSG: this.in_VerificationInfo
    }).auditTime(500)
      .subscribe(data => {
        let succ = data.success;
        if (succ == 1 || succ == "1") {
          this.globalData.showLoading = true;
          let alert = this.alertCtrl.create({
            title: '申请已发送!',
            subTitle: '您的好友申请已经发送给对方，对方同意后就能成为好友了!',
            buttons: [{
              text: "确定",
              handler: data => {
                this.navCtrl.pop();
              }
            }]
          });
          alert.present();

          //推送添加好友消息
          let hm: string = Utils.dateFormat(new Date(), "HH:mm");
          let date: string = Utils.dateFormat(new Date(), "MM-dd");
          let msgContent: ChatMessage = {
            msgId: new Date().getTime().toString(),
            msg: {changingThisBreaksApplicationSecurity: this.in_VerificationInfo},
            sendingTime: hm, sendingDate: date, portrait: 'newFriend',
            type: 'newFriend', from: 'newFriend', fromName: '新的好友', fromType: 'chat'
          };
          this.eoChatService.sendPrivateText(msgContent, this.item.USER001);
        }
      });
  }


}
