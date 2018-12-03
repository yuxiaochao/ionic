import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../../service/CommonService";
import {GlobalData} from "../../../../../providers/GlobalData";
import {NativeService} from "../../../../../providers/NativeService";

/**
 * Generated class for the TaskdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-taskdetail',
  templateUrl: 'taskdetail.html',
})
export class TaskdetailPage {

  calt001: string;
  taskInfo: any = [];
  userid: string;
  toppings:number;
  callback:any;
  taskZxInfo:any=[];
  i:number=1;
  j:number=3;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              private globalData: GlobalData,
              public nativeService: NativeService,
              public alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    this.calt001 = this.navParams.get("CALT001");
    this.userid = this.globalData.userId;
    this.callback = this.navParams.get("callback");
    this.initTaskInfo();
  }

  //获取会议信息
  initTaskInfo() {
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/taskInfo',
      {calt001: this.calt001}).subscribe(data => {
      if (data.taskInfo[0]) {
        this.taskInfo = data.taskInfo[0];
        this.taskZxInfo = this.taskInfo['taskZxInfo'];
      }
    });
  }

  showUser(type){
    let param:any=[];
    if(type==0){
      param=this.taskInfo['taskZxInfo'];
    }else if(type==1){
      param=this.taskInfo['taskXzInfo'];
    }else if(type==2){
      param=this.taskInfo['taskLdInfo'];
    }
    this.navCtrl.push('UserListPage', {
      meetingUserInfo:param,
    });
  }


  toChange() {
    this.i == 1 ? this.i = 2 : this.i = 1;
    this.j == 3 ? this.j = 4 : this.j = 3;
    if (this.toppings == 1|| this.toppings==2) {//修改任务
      this.navCtrl.push('AddrenwulistPage', {
        callback: () => {
          return new Promise((resolve, reject) => {
            this.initTaskInfo();
            resolve();
          });
        },
        CALT001: this.calt001,
        thisType:1
      });
    } else if (this.toppings == 3|| this.toppings==4) {//取消任务
      let alert = this.alertCtrl.create({
        message: '是否取消任务？',
        buttons: [
          {
            text: '取消',
            handler: () => {
            }
          },
          {
            text: '确定',
            handler: () => {
              this.commonService.getPage('/huarui/hrswTCalendarmemorandum/cancelTask',
                {CALT001: this.calt001}).subscribe(data => {
                if (data.flag) {
                  this.nativeService.alert("取消成功", '', '', () => {
                    this.callback().then(() => {
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
