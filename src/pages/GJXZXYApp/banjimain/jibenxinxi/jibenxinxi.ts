import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalData} from "../../../../providers/GlobalData";
import {CommonService} from "../../../../service/CommonService";
import { CallNumber } from '@ionic-native/call-number';
import {THIS_EXPR} from "@angular/compiler/src/output/output_ast";
import {CanteenDetailsPage} from "./canteen-details/canteen-details";
import {DormitoryDetailsPage} from "./dormitory-details/dormitory-details";

/**
 * Generated class for the JibenxinxiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jibenxinxi',
  templateUrl: 'jibenxinxi.html',
})
export class JibenxinxiPage {

  teacherInfo:any=[];//教师信息
  canteenInfo:any=[];//食堂信息
  dormitoryInfo:any=[];//宿舍信息


  canteenName:string; //食堂名称
  BreakfastTime:any=[];//早餐时间
  LunchTime:any=[];//午餐时间
  DinnerTime:any=[];//晚餐
  canteenNumber:string;//食堂可容纳人数
  canteenPhoto:string;//订餐电话


  dormitory:any=[];//宿舍

  Headmaster:any={};
  AssistantTeacher:any={};
  classAssistant:any={};


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globDate:GlobalData,
              public commonService:CommonService,
              private callNumber: CallNumber,
              public  alert:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JibenxinxiPage');
    let trainCourse=this.globDate.currentTrainingClass;
    this.initDate();
  }

  initDate(){
    this.commonService.getPage('/huarui/xzxyTDinnerinformation/findDinnerinformation')
      .auditTime(500).subscribe(data=>{
      if(data){
        this.canteenInfo=data.infoList;
        this.dormitoryInfo=data.hotelroomList;
        this.teacherInfo=data.peopleList;

        for(let i=0;i<this.teacherInfo.length;i++){
          if(this.teacherInfo[i]["TRPP008"]=='班主任'){
             this.Headmaster=this.teacherInfo[i];
          }else if(this.teacherInfo[i]["TRPP008"]=='班主任助理'){
               this.AssistantTeacher=this.teacherInfo[i];
          }else if(this.teacherInfo[i]["TRPP008"]=='班务助理'){
               this.classAssistant=this.teacherInfo[i]
          }

        }


        for(let i=0;i<this.canteenInfo.length;i++){
          if(this.canteenInfo[i]["DINN003"]=='早餐'){
             this.BreakfastTime=this.canteenInfo[i]
          }else if(this.canteenInfo[i]["DINN003"]=='午餐'){
             this.LunchTime=this.canteenInfo[i]
          }else if(this.canteenInfo[i]["DINN003"]=='晚餐'){
            this.DinnerTime=this.canteenInfo[i];
          }
        }

        this.canteenName=this.canteenInfo[0]["CANT003"];
        this.canteenNumber=this.canteenInfo[0]["CANT004"];
        this.canteenPhoto=this.canteenInfo[0]["CANT006"];

        if(this.dormitoryInfo.length>=1){
          this.dormitory=this.dormitoryInfo[0];
        }else{
          this.dormitory={
           "HOTE002":'暂无数据',
            "HORO003":'暂无数据',
            "HOTE006":'暂无数据',
            "HORO008":'暂无数据',
            "HORO007":'暂无数据'
          };
        }



      }else{

      }
    });
  }


  shizixinxiClick(){
    this.navCtrl.push('ShizixinxiPage');
  }

  //拨打电话
  callPhone(obj){
     let aller=this.alert.create({
       title:obj,
       buttons:[{
         text:'取消',
         handler:()=>{

         }
       },{
         text:'呼叫',
         handler:()=>{
           this.callNumber.callNumber(obj, true)
             .then(res => console.log('Launched dialer!', res))
             .catch(err => console.log('Error launching dialer', err));
         }
       }]
     }).present();
  }

  //餐厅详情
  canteenDetails(){
    this.navCtrl.push('CanteenDetailsPage',{CANTEEN:this.canteenInfo});
  }

  //宿舍详情
  dormitorydetails(){
    this.navCtrl.push('DormitoryDetailsPage',{DORMITORY:this.dormitoryInfo});
  }

}
