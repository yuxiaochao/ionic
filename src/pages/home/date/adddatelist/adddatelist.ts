import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RemindtxPage} from "./remindtx/remindtx";
import {RepetitioncfPage} from "./repetitioncf/repetitioncf";
import {CommonService} from "../../../../service/CommonService";
import {NativeService} from "../../../../providers/NativeService";
import {ScheduleRemindService} from "../../../../providers/ScheduleRemindService";
import {GlobalData} from "../../../../providers/GlobalData";


@IonicPage()
@Component({
  selector: 'page-adddatelist',
  templateUrl: 'adddatelist.html',
})
export class AdddatelistPage {

  scheduleText:string;
  startDate:Date;
  endDate:Date;
  remind:number;
  repeat:number;
  remarksText:string;
  callback:any;
  constructor(public navCtrl: NavController,
              public nativeService: NativeService,
              public navParams: NavParams,
              public commonService : CommonService,
              private scheduleRemindService: ScheduleRemindService,
              private globalData: GlobalData,) {
  }

  ionViewDidLoad() {
    this.callback = this.navParams.get("callback");
  }

  //跳转提醒页面
  remindtxClick(){
    this.navCtrl.push('RemindtxPage', {
      callback: (data)=>{
        return new Promise((resolve, reject) => {
          this.remind = data;
          resolve();
        });
      },
      remind:this.remind
    });
  }

  //跳转重复页面
  repetitcfClick(){
    this.navCtrl.push('RepetitioncfPage', {
      callback: (data)=>{
        return new Promise((resolve, reject) => {
          this.repeat = data;
          resolve();
        });
      },
      repeat:this.repeat
    });
  }

  //提交日程
  submitSchedule(){
    if(!this.scheduleText){
      return this.nativeService.alert("请输入日程内容");
    }else if(!this.startDate){
      return this.nativeService.alert("请选择开始时间");
    }else if(!this.endDate){
      return this.nativeService.alert("请选择结束时间");
    }
    if(!this.remind){
      this.remind=0;
    }
    if(!this.repeat){
      this.repeat=0;
    }
    if(!this.remarksText||this.remarksText==undefined||this.remarksText=='undefined'){
      this.remarksText='';
    }

    this.commonService.getPage(
      '/huarui/hrswTCalendarmemorandum/addSchedule',
      {
        scheduleText:this.scheduleText,//日程信息文本
        startDate:this.startDate,//开始时间
        endDate:this.endDate,//结束时间
        remind:this.remind,//提醒方式
        repeat:this.repeat,//重复方式
        remarksText:this.remarksText//添加备注
      }).subscribe(data=>{
        if(data.flag){
          this.callback().then(()=>{
            //初始化日程提醒队列
            this.scheduleRemindService.getScheduleRemindList(this.globalData.userId);
            this.navCtrl.pop();
          });
        }else{
          return this.nativeService.alert("添加日程失败！");
        }
    });

  }

}
