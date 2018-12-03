import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";


 /**
  * Generated class for the WkmtdetailPage page.
  *
  * See https://ionicframework.com/docs/components/#navigation for more info on
  * Ionic pages and navigation.
  */

 @IonicPage()
 @Component({
   selector: 'page-detailsofthemeeting',
   templateUrl: 'detailsofthemeeting.html',
 })
 export class DetailsofthemeetingPage {

   meeting={};//会议详情
   totalNumber:number;//参会人数
   signNumber:number;//签到人数
   peopleList:string//参会人员
   organizer:string;//组织者

   constructor(public navCtrl: NavController,
               public navParams: NavParams,
               public commonService:CommonService) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad WkmtdetailPage');
     this.meeting=this.navParams.get("MEETING");
     this.initDate();
   }
   initDate(){
     this.initInfo({MEET001:this.meeting["MEET001"],METP003:1}).subscribe(data=>{
       if(data){
         this.totalNumber=data.totalNumber;
         this.peopleList=data.peopleList;
         this.signNumber=data.signNumber;

         for(let i=0;i<this.peopleList.length;i++){
           if(this.peopleList[i]["TYPEOFPERSONNEL"]==1){
             this.organizer=this.peopleList[i]["USERNAME"];
           }
         }

       }
     })
   }

   initInfo(paramMap?){
     return this.commonService.getPage('/huarui/hrswTCalendarmeeting/totalNumber',paramMap);
   }

 }


