import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {HttpService} from "../../../providers/HttpService";
import {GlobalData} from "../../../providers/GlobalData";

@IonicPage()
@Component({
  selector: 'page-chat-settings',
  templateUrl: 'chat-settings.html',
})
export class ChatSettingsPage {
  otherParty: string = "";//对方id
  otherUser: any = {};
  queryVeryConcerned:any=[];
  mushrooms: any = {isCheck: false};
  initialType:boolean;
  constructor(public navCtrl: NavController,
              public commonService: CommonService,
              private httpService: HttpService,
              public navParams: NavParams,
              private globalData : GlobalData,
              public alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatSettingsPage');
    this.otherParty = this.navParams.get("USERID");//获取聊天对象userid
    this.initData();
  }

  initData() {
    if (this.otherParty) {
      this.httpService.postFormData('/mine/userInfo', {
        'USER001': this.otherParty
      }).subscribe(data => {
        if (data) {
          this.otherUser = data.userInfo;
        }
      });
    }

    this.commonService.getPage('/cts/queryVeryConcerned', {otherUserid: this.otherParty}).subscribe(data => {
      if (data.queryVeryConcerned&&data.queryVeryConcerned[0]) {
        this.queryVeryConcerned = data.queryVeryConcerned[0];
        this.mushrooms.isCheck = this.queryVeryConcerned['frrs007'] == '1';
        this.initialType = this.queryVeryConcerned['frrs007'] == '1';
      } else {
        this.mushrooms.isCheck = false;
        this.initialType = false;
      }
    });
  }

  isChange(){
    if (this.initialType != this.mushrooms.isCheck) {
      let frrs007 = '';
      if (this.mushrooms.isCheck) {
        frrs007 = '1'
      } else {
        frrs007 = '0'
      }
      this.globalData.showLoading=false;
      this.commonService.getPage('/cts/setVeryConcerned',
        {otherParty: this.otherParty, frrs007: frrs007}).subscribe(data => {
      });
      this.globalData.showLoading=true;
    }
  }

  deleteFriend(){
    let alert = this.alertCtrl.create({
      message: '是否删除好友？',
      buttons: [
        {
          text: '取消',
          handler: () => {}
        },
        {
          text: '确定',
          handler: () => {
            this.commonService.getPage('/cts/deleteFriend', {otherParty: this.otherParty}).subscribe(data => {
              this.navCtrl.pop();
            });
          }
        }

      ]
    });
    alert.present();
  }

  toChatRecord(){
    this.navCtrl.push("ChatRecordPage",{thisUSERID:this.otherParty});
  }

  toVeryConcerned(){
    this.navCtrl.push("VeryConcernedPage",{thisUSERID:this.otherParty});
  }

}
