import { Component } from '@angular/core';
import {AlertController, App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {UpdatePwdPage} from "./update-pwd/update-pwd";
import {CommonService} from "../../service/CommonService";
import {FirstStatusPage} from "./first-status/first-status";
import {Storage} from "@ionic/storage";
import {Helper} from "../../providers/Helper";

/**
 * Generated class for the GbjxOwnPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gbjx-own',
  templateUrl: 'gbjx-own.html',
})
export class GbjxOwnPage {

  userInfo = {};
  usst003:number=0;//用户状态
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public appCtrl: App,
              private helper: Helper,
              public  alert: AlertController) {
  }

  ionViewDidEnter() {
    this.initDate();
  }

  initDate() {
    this.commonService.getPage('/mine/MyuserInfo').subscribe(data => {
      if (data) {
        let item = data.userInfo;
        this.userInfo = item[0];
        if(this.userInfo['USST003']){
          this.usst003 = this.userInfo['USST003'];
        }
      }
    });
  }

  recordClick(){
    this.navCtrl.push('RecordPage');
  }



  PersonalClick(){
    this.navCtrl.push('PersonalPage');  //跳转个人信息
  }

  statusClick(obj){
    this.navCtrl.push('FirstStatusPage',{ITEM:obj}) //跳转工作状态
  }

  ErweicodeClick(obj){
    this.navCtrl.push('ErweicodePage',{TIME:obj});  //跳转二维码名片
  }

  //退出登录
  electiveCourse() {
    let alert = this.alert.create({
      title: '确定要退出吗？',
      buttons: [{
        text: '取消',
        handler: () => {
        }
      }, {
        text: '确定',
        handler: () => {
          this.helper.tuichudenglu();//统一退出登录方法
        }
      }]
    }).present()

  }

  //修改密码
  updatePwd(){
    this.navCtrl.push("UpdatePwdPage");
  }

  // intoExamDetail(item){
  //   this.navCtrl.push('OnlineExamDetailPage',{tact001:item.TACT001});
  // }
}
