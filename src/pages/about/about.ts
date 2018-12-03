import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CommonService} from "../../service/CommonService";
import {GlobalData} from "../../providers/GlobalData";
//import {Storage} from "@ionic/storage";
import { AlertController } from 'ionic-angular';
//import {MyinfoPage} from "./myinfo/myinfo";

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
    items: any = {};
   constructor(
          public navCtrl: NavController,
          public commonService : CommonService,
          private globalData : GlobalData,
          public alertCtrl: AlertController
       ) {}
  ionViewDidLoad(){
        this.initDate();
  }
  //我的信息
  initDate(){
    let USER001 = this.globalData.userId;
    this.initInfo({USER001:USER001}).subscribe(data=>{
      if(data.userInfo){
        this.items = data.userInfo;
      }
    });

  }

  initInfo(paramMap?){
    return  this.commonService.getInfo(paramMap);
  }



  //查询个人信息
  showInfo(){
     this.navCtrl.push('MyinfoPage');
  }

  //考试记录
  showExam(){
     this.navCtrl.push('ExamnotesPage');
  }

  //调查记录
  surveyRecords(){
     this.navCtrl.push('SurveyRecordsPage');
   }

  //学习记录
    showStudy(){
     this.navCtrl.push('StudynotesPage');
   }
   //离线中心
   OfflineCenter(){
     this.navCtrl.push('OfflinePage');
    }

    //课堂笔记
  classNotes(){
    this.navCtrl.push('ClassnotesPage');
  }

  //我的二维码
  myTwoCode(){
     this.navCtrl.push('TwocodePage');
  }

 //关于系统
  AboutSystem(){
    this.navCtrl.push('SystemPage');
  }

  //设置
  SetUp(){
    this.navCtrl.push('SetupPage');
  }



}
