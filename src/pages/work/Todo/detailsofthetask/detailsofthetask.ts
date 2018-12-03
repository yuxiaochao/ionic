
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {Utils} from "../../../../providers/Utils";


/**
 * Generated class for the TaskdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailsofthetask',
  templateUrl: 'detailsofthetask.html',
})
export class DetailsofthetaskPage {

  taskInfo={};//任务信息
  startTime;
  endTime;
  //距离开始时间
  startDay=0;
  startHours=0;
  startMinute=0;

  //距离结束时间
  endDay=0;
  endHours=0;
  endMinute=0;

  timer;

  MEET001:string;
  totalNumber:number;//参会人数
  peopleList:string;//参会人信息
  signNumber:number;//签到人数
  assistant=[];//协助人
  leadership=[];//主管领导
  assignor=[];
  flage=0;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskdetailPage');

    this.MEET001=this.navParams.get("ITEM");
    this.initDate();
    //this.sdere();


  }
  initDate(){
    this.initInfo({MEET001:this.MEET001,METP003:2}).subscribe(data=>{
      if(data){

        this.totalNumber=data.totalNumber;
        this.peopleList=data.peopleList;
        this.signNumber=data.signNumber;

        for(let i=0;i<this.peopleList.length;i++){
          if(this.peopleList[i]["TYPEOFPERSONNEL"]==4){
            this.assistant.push(this.peopleList[i]["USERNAME"]);
          }else if(this.peopleList[i]["TYPEOFPERSONNEL"]==5){
            this.leadership.push(this.peopleList[i]["USERNAME"]);
          }else if(this.peopleList[i]["TYPEOFPERSONNEL"]==3){
            this.assignor.push(this.peopleList[i]["USERNAME"]);
          }

        }

        this.commonService.getPage('/huarui/hrswTCalendarmeeting/taskDetails',{CALT001:this.MEET001}).subscribe(data01=>{

          if(data01){

            let taskInfo=data01.taskDetails;
            this.taskInfo=taskInfo[0];

            this.startTime=this.taskInfo["STARTIME"];
            this.endTime=this.taskInfo["ENDIME"];

            this.sdere();
          }
        })
      }
    })



  }

  initInfo(paramMap?){
    return this.commonService.getPage('/huarui/hrswTCalendarmeeting/totalNumber',paramMap);
  }



  //STARTIME
  timeDifference(obj,obj01){
    if(new Date().getTime()<this.endTime){
      let time=new Date().getTime();

      if(obj>time){
         this.flage=0
        let aaa=obj-time
        //小时
        this.startHours=Math.floor(aaa/3600000);

         let dd=this.startHours/24

          if(dd>=1){
           //天数
           this.startDay=Math.floor(dd);
           let ff =this.startHours%24*24;
           this.startHours=Math.floor(ff);
          }

        //分钟
        this.startMinute=Math.floor((aaa%3600000)/(60*1000));
      }else if(time>obj && time<obj01){
         this.flage=1
        let aaa=obj01-time;
        //小时
        this.endHours=Math.floor(aaa/3600000);

        let dd=this.endHours/24
        if(dd>=1){
          //天数
          this.endDay=Math.floor(dd);

          let ee=this.endHours%24
          this.endHours=Math.floor(ee);
        }

        //分钟
        this.endMinute=Math.floor((aaa%3600000)/(60*1000));
      }
    }else {
          this.flage=2
      clearInterval(this.timer);
    }



  }

  sdere(){

    if(new Date().getTime()<this.endTime){
      this.timer=setInterval(()=>{
        this.timeDifference(this.startTime,this.endTime);
      },1000)
    }else{
      this.flage=2;
    }
    }

}

