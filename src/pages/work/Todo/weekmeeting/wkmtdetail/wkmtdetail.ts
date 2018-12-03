import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../../service/CommonService";
import {NativeService} from "../../../../../providers/NativeService";
import {GlobalData} from "../../../../../providers/GlobalData";

/**
 * Generated class for the WkmtdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wkmtdetail',
  templateUrl: 'wkmtdetail.html',
})
export class WkmtdetailPage {

  i:number=1;
  j:number=3;
  k:number=5;

  meet001: string;
  meetingInfo: any = [];
  option: string;//组织者id
  zzUsername: string;//组织者姓名
  toppings: number;
  callback:any;
  userid:string;
  meetingZZUserInfo:any=[];
  meetingCHUserInfo:any=[];
  meetingQDUserInfo:any=[];
  istype:number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public nativeService: NativeService,
              private globalData : GlobalData,
              public alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    this.callback = this.navParams.get("callback");
    this.meet001 = this.navParams.get("MEET001");
    this.istype = this.navParams.get("ISTYPE");
    this.userid = this.globalData.userId;
    this.initMeetingInfo();
  }

  //获取会议信息
  initMeetingInfo() {
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/meetingInfo',
      {meet001: this.meet001}).subscribe(data => {
      if (data.meetingInfo[0]) {
        this.meetingInfo = data.meetingInfo[0];
        this.meetingZZUserInfo = data.meetingZZUserInfo;
        this.meetingCHUserInfo = data.meetingCHUserInfo;
        this.meetingQDUserInfo = data.meetingQDUserInfo;
      }
    });
  }

  //增加任务页面
  addrenwuClick(item) {
    this.navCtrl.push('AddrenwulistPage', {
      callback: () => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      }, thisType: item
    });
  }

  showUser(type){
    let param:any=[];
    if(type==0){
      param=this.meetingZZUserInfo
    }else if(type==1){
      param=this.meetingCHUserInfo
    }else if(type==2){
      param=this.meetingQDUserInfo
    }
    this.navCtrl.push('UserListPage', {
      meetingUserInfo:param,
    });
  }

  toChange() {
    this.i == 1 ? this.i = 2 : this.i = 1;
    this.j == 3 ? this.j = 4 : this.j = 3;
    this.k == 5 ? this.k = 6 : this.k = 5;
  if (this.toppings == 1 || this.toppings==2) {//展示签到二维码
      this.navCtrl.push('SigninQrCodePage',{MEET001:this.meetingInfo['MEET001']});
    } else if (this.toppings == 3 || this.toppings==4) {//修改会议
      this.navCtrl.push('AddhuiyilistPage', {
        callback: () => {
          return new Promise((resolve, reject) => {
            this.initMeetingInfo();
            resolve();
          });
        },MEET001:this.meetingInfo['MEET001']
      });
    } else if (this.toppings == 5 || this.toppings == 6) {//取消会议
      let alert = this.alertCtrl.create({
        message: '是否取消会议？',
        buttons: [
          {
            text: '取消',
            handler: () => {
            }
          },
          {
            text: '确定',
            handler: () => {
              this.commonService.getPage('/huarui/hrswTCalendarmemorandum/cancelMeeting',
                {meet001:this.meet001}).subscribe(data => {
                if(data.flag){
                  this.nativeService.alert("取消成功",'','',()=>{
                    this.callback().then(()=>{
                      this.navCtrl.pop();
                    });
                  });
                }
              });
            }
          }
        ]
      });
      alert.present();
    }
  }

}
