import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ChangephonePage} from "./changephone/changephone";
 import {LvliPage} from "./lvli/lvli";
 import {ChangepasswordPage} from "./changepassword/changepassword";
import {Helper} from "../../../providers/Helper";
import {CommonService} from "../../../service/CommonService";

@IonicPage()
@Component({
  selector: 'page-wodemain',
  templateUrl: 'wodemain.html',
})
export class WodemainPage {

  userInfo:any=[];
  usst003:string;
  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              private helper: Helper,
              public  alert: AlertController,
              public commonService: CommonService,) {
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad WodemainPage');
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
  cardClick(){
    this.navCtrl.push('MycardPage',{userInfo:this.userInfo});
  }
  infoClick(){
    this.navCtrl.push('MyInfoPage',{userInfo:this.userInfo});
  }

  changeClick(){
    this.navCtrl.push('ChangephonePage');
  }
  recordClick(){
    this.navCtrl.push('LvliPage');
  }
  updatePwd(){
    this.navCtrl.push('ChangepasswordPage');
  }
  setClick(){
    this.navCtrl.push('ClearcachePage');
  }
  aboutClick(){
    this.navCtrl.push('AboutminePage');
  }
  gengxinClick(){
    $("#gengxin").css("display","block");
  }
  stopClick(){

    $("#gengxin").css("display","none");
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

}
