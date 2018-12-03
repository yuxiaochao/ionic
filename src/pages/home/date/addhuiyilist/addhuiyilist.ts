import {Component} from '@angular/core';
import {DateTime, IonicPage, NavController, NavParams} from 'ionic-angular';
import {RemindtxPage} from "../adddatelist/remindtx/remindtx";
import {NativeService} from "../../../../providers/NativeService";
import {CommonService} from "../../../../service/CommonService";
import {TouchPunchProvider} from "../../../../app/touchPunch";
import {ScheduleRemindService} from "../../../../providers/ScheduleRemindService";
import {GlobalData} from "../../../../providers/GlobalData";

@IonicPage()
@Component({
  selector: 'page-addhuiyilist',
  templateUrl: 'addhuiyilist.html',
})
export class AddhuiyilistPage {
  callback: any;
  meetingRoomList: any = [];//会议室集合
  zzUsername: string;//组织者姓名

  option: string;//组织者id
  chUserid: any = [];//参会人id集合
  meetingText: string;//会议内容
  startDate: any;//开始时间
  endDate: any;//开始时间
  toppings: string;//会议室
  address: string;//地址
  remind: number;//提醒类型
  meet001:string;
  updateInfo:boolean=false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public nativeService: NativeService,
              public commonService: CommonService,
              private scheduleRemindService: ScheduleRemindService,
              private globalData: GlobalData,) {
  }

  ionViewDidLoad() {
    this.meet001 = this.navParams.get("MEET001");
    if(this.meet001!=''&&this.meet001!=undefined){
      this.updateInfo = true;
      this.initMeetingInfo();
    }
    this.callback = this.navParams.get("callback");
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/meetingRoom',{cata005:'meetingroom'}).subscribe(data => {
      if (data.meetingRoomList) {
        this.meetingRoomList = data.meetingRoomList;
      }
    });
  }

  //获取会议信息
  initMeetingInfo() {
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/meetingInfo',
      {meet001: this.meet001}).subscribe(data => {
      if (data.meetingInfo[0]) {
        let meetingInfo:any = data.meetingInfo[0];
        this.option = (data.meetingZZUserInfo[0])['metp005'];
        data.meetingCHUserInfo.forEach(item=>{
          this.chUserid.push(item['metp005']);
        });
        this.meetingText = meetingInfo['MEET002'];
        this.startDate = new Date(meetingInfo['MEET003']);
        let a = this.startDate.getHours();
        this.startDate = this.startDate.setHours(a+8);
        this.startDate = new Date(this.startDate).toISOString();

        this.endDate = new Date(meetingInfo['MEET004']);
        a = this.endDate.getHours();
        this.endDate = this.endDate.setHours(a+8);
        this.endDate = new Date(this.endDate).toISOString();
        this.toppings = meetingInfo['MEET005'];
        this.address = meetingInfo['MEET006'];
        this.remind = meetingInfo['MEET007'];
      }
    });
  }

  //跳转会议组织人
  hyorgantionmanClick() {
    let thisType = -1;
    if(this.updateInfo){
      thisType = 1;
    }
    this.navCtrl.push('HyorganizationmanPage', {
      callback: (data1, data2) => {
        return new Promise((resolve, reject) => {
          this.option = data1;
          this.zzUsername = data2;
          resolve();
        });
      },
      option: this.option,
      optionType: 0,//0.单选 1.多选
      thisType:thisType
    });
  }

  //跳转参会人
  attendeeClick() {
    let thisType = -1;
    if(this.updateInfo){
      thisType = 1;
    }
    this.navCtrl.push('HyorganizationmanPage', {
      callback: (data) => {
        return new Promise((resolve, reject) => {
          this.chUserid = data;
          resolve();
        });
      },
      checkOption: this.chUserid,
      optionType: 1,//0.单选 1.多选
      thisType:thisType
    });
  }

  //跳转会议提醒页面
  remindtxClick() {
    this.navCtrl.push('RemindtxPage', {
      callback: (data) => {
        return new Promise((resolve, reject) => {
          this.remind = data;
          resolve();
        });
      },
      remind: this.remind
    });
  }

  //提交会议
  submitMeeting() {
    if (!this.meetingText) {
      return this.nativeService.alert("请输入会议内容");
    } else if (!this.startDate) {
      return this.nativeService.alert("请选择开始时间");
    } else if (!this.endDate) {
      return this.nativeService.alert("请选择结束时间");
    }else if (!this.address) {
      return this.nativeService.alert("请输入地址");
    }else if (!this.option) {
      return this.nativeService.alert("请选择会议组织者");
    }else if (this.chUserid.length<=0) {
      return this.nativeService.alert("请选择参会人");
    }
    if (!this.remind) {
      this.remind = 0;
    }

    this.commonService.getPage(
      '/huarui/hrswTCalendarmemorandum/addMeeting',
      {
        meetingText: this.meetingText,//会议内容
        startDate: this.startDate,//开始时间
        endDate: this.endDate,//结束时间
        remind: this.remind,//提醒方式
        option: this.option,//组织者id
        chUserid: this.chUserid,//参会人id集合
        address: this.address,//地址
        toppings: this.toppings,//会议室
        updateInfo:this.updateInfo,
        meet001:this.meet001
      }
    ).subscribe(data => {
      if (data.flag) {
        this.callback().then(() => {
          //初始化日程提醒队列
          this.scheduleRemindService.getScheduleRemindList(this.globalData.userId);
          this.navCtrl.pop();
        });
      } else {
        let title:string;
        if(this.updateInfo){
          title='修改会议失败！'
        }else {
          title='添加会议失败！'
        }
        return this.nativeService.alert(title);
      }
    });
  }
}
