import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LabelrenwPage} from "./labelrenw/labelrenw";
import {TixinrenPage} from "./tixinren/tixinren";
import {CommonService} from "../../../../service/CommonService";
import {NativeService} from "../../../../providers/NativeService";
import {ScheduleRemindService} from "../../../../providers/ScheduleRemindService";
import {GlobalData} from "../../../../providers/GlobalData";

/**
 * Generated class for the AddrenwulistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addrenwulist',
  templateUrl: 'addrenwulist.html',
})
export class AddrenwulistPage {

  callback:any;
  ldUserid: any = [];//领导id集合
  xzUserid: any = [];//协助人id集合
  zxUserid: any = [];//执行人id集合
  zrUserid: string='';//责任人id集合
  zrUsername: string='';//责任人名集合
  remind: number;
  startDate: any;//开始时间
  endDate: any;//结束时间
  signInNum: string;//签到次数
  taskType: any = [];//任务类型集合
  toppings: string;//已选择的任务类型
  taskLabelId: string;//标签Id
  taskLabelName: string;//标签名
  taskAddress: string;//任务地点
  taskText: string;//任务内容
  thisType:number;
  calt001:string;
  updateInfo:boolean=false;
  taskInfo: any = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public nativeService: NativeService,
              private scheduleRemindService: ScheduleRemindService,
              private globalData: GlobalData,) {
  }

  ionViewDidLoad() {
    this.calt001 = this.navParams.get("CALT001");
    if(this.calt001!=''&&this.calt001!=undefined){
      this.updateInfo = true;
      this.initTaskInfo();
    }
    this.callback = this.navParams.get("callback");
    this.thisType = this.navParams.get("thisType");
    this.initTaskType();
  }

  //任务类型列表
  initTaskType() {
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/meetingRoom',
      {cata005: 'renwuleixing'}).subscribe(data => {
      if (data.meetingRoomList) {
        this.taskType = data.meetingRoomList;
      }
    });
  }
  //获取会议信息
  initTaskInfo() {
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/taskInfo',
      {calt001: this.calt001}).subscribe(data => {
      if (data.taskInfo[0]) {
        let taskInfo:any = data.taskInfo[0];
        taskInfo['taskLdInfo'].forEach(item=>{
          this.ldUserid.push(item.METP005);
        });
        taskInfo['taskXzInfo'].forEach(item=>{
          this.xzUserid.push(item.METP005);
        });
        taskInfo['taskZxInfo'].forEach(item=>{
          this.zxUserid.push(item.METP005);
        });
        this.taskText = taskInfo.CALT002;
        this.remind = taskInfo.CALT008;
        this.startDate = new Date(taskInfo.CALT005);
        let a = this.startDate.getHours();
        this.startDate = this.startDate.setHours(a+8);
        this.startDate = new Date(this.startDate).toISOString();

        this.endDate = new Date(taskInfo.CALT006);
        a = this.endDate.getHours();
        this.endDate = this.endDate.setHours(a+8);
        this.endDate = new Date(this.endDate).toISOString();
        let datePickerDate = new Date();
        datePickerDate.setHours(parseInt(taskInfo.CALT007+8));
        this.signInNum = datePickerDate.toISOString();
        this.toppings = taskInfo.CALT003;
        this.taskLabelId = taskInfo.TLRE003;
        this.taskAddress = taskInfo.CALT004;
        this.taskLabelName = taskInfo.TALI002;
      }
    });
  }

  labelrenwClick() {//跳转任务标签
    if(!this.zrUserid||this.zrUserid==''){
      return this.nativeService.alert("请先选择责任人！");
    }
    this.navCtrl.push('LabelrenwPage', {
      callback: (data1, data2) => {
        return new Promise((resolve, reject) => {
          this.taskLabelId = data1;
          this.taskLabelName = data2;
          resolve();
        });
      },
      taskLabelId: this.taskLabelId,
      zrUserid:this.zrUserid
    });
  }

  placerenwuClick() {  //跳转任务地点
    this.navCtrl.push('PlacerenwPage');
  }

  systemnewClick(){
    this.navCtrl.push('DrawbarPage');
  }

  tixinrenClick() {//跳转任务提醒
    this.navCtrl.push('TixinrenPage', {
      callback: (data) => {
        return new Promise((resolve, reject) => {
          this.remind = data;
          resolve();
        });
      },
      remind: this.remind
    });
  }

  zerenren(){//跳转责任人
    this.navCtrl.push('HyorganizationmanPage', {
      callback: (data1,data2) => {
        return new Promise((resolve, reject) => {
          this.zrUserid = data1;
          this.zrUsername = data2;
          resolve();
        });
      },
      thisType:this.thisType,
      checkOption: this.zrUserid,
      optionType: 0//0.单选 1.多选
    });
  }

  zhixingren() {//跳转执行人
    this.navCtrl.push('HyorganizationmanPage', {
      callback: (data) => {
        return new Promise((resolve, reject) => {
          this.zxUserid = data;
          resolve();
        });
      },
      thisType:this.thisType,
      checkOption: this.zxUserid,
      optionType: 1//0.单选 1.多选
    });
  }

  xiezhuren() {//跳转协助人
    this.navCtrl.push('HyorganizationmanPage', {
      callback: (data) => {
        return new Promise((resolve, reject) => {
          this.xzUserid = data;
          resolve();
        });
      },
      thisType:this.thisType,
      checkOption: this.xzUserid,
      optionType: 1//0.单选 1.多选
    });
    //this.navCtrl.push('XiezhurenwPage');
  }

  zhuguanlingdao() {//跳转主管领导
    this.navCtrl.push('HyorganizationmanPage', {
      callback: (data) => {
        return new Promise((resolve, reject) => {
          this.ldUserid = data;
          resolve();
        });
      },
      thisType:this.thisType,
      checkOption: this.ldUserid,
      optionType: 1//0.单选 1.多选
    });
    //this.navCtrl.push('ZhuguanbossPage');
  }

  //提交任务
  submitTask() {
    let aa:Array<string>=[];
    if(this.signInNum.indexOf('T')== -1){
       aa= this.signInNum.split(':');
    }else{
      aa= this.signInNum.split('T');
      aa = aa[1].split(':');
    }
    this.signInNum = aa[0];
    if (!this.taskText) {
      return this.nativeService.alert("请输入任务内容");
    } else if (!this.taskLabelId) {
      return this.nativeService.alert("请选择任务标签");
    } else if (!this.zrUserid) {
      return this.nativeService.alert("请选择责任人");
    } else if (!this.taskAddress) {
      return this.nativeService.alert("请填写任务地点");
    } else if (!this.toppings) {
      return this.nativeService.alert("请选择任务类型");
    } else if (!this.startDate) {
      return this.nativeService.alert("请选择开始时间");
    } else if (!this.endDate) {
      return this.nativeService.alert("请选择结束时间");
    } else if (!this.signInNum) {
      return this.nativeService.alert("请填写签到次数");
    } else if (this.zxUserid.length<=0) {
      return this.nativeService.alert("请选择执行人");
    } else if (this.xzUserid.length<=0) {
      return this.nativeService.alert("请选择协助人");
    } else if (this.ldUserid.length<=0) {
      return this.nativeService.alert("请选择主管领导");
    }
    if (!this.remind) {
      this.remind = 0;
    }

    this.commonService.getPage(
      '/huarui/hrswTCalendarmemorandum/addTask',
      {
        ldUserid: this.ldUserid,//领导id集合
        xzUserid: this.xzUserid,//协助人id集合
        zxUserid: this.zxUserid,//执行人id集合
        zrUserid: this.zrUserid,//责任人id集合
        remind: this.remind,
        startDate: this.startDate,//开始时间
        endDate: this.endDate,//结束时间
        signInNum: this.signInNum,//签到内容
        toppings: this.toppings,//已选择的任务类型
        taskLabelId: this.taskLabelId,//标签Id
        taskAddress: this.taskAddress,//任务地点
        taskText: this.taskText,//任务内容
        updateInfo:this.updateInfo,
        calt001:this.calt001
      }
    ).subscribe(data => {
      if (data.flag) {
        this.callback().then(() => {
          //初始化日程提醒队列
          this.scheduleRemindService.getScheduleRemindList(this.globalData.userId);
          this.navCtrl.pop();
        });
      } else {
        return this.nativeService.alert("添加任务失败！");
      }
    });
  }
}
