import {HttpService} from "./HttpService";
import {Injectable} from "@angular/core";
import {NativeService} from "./NativeService";
import {App, NavController, ToastController} from "ionic-angular";


@Injectable()
export class ScheduleRemindService {

  private _scheduleList: Array<any> = [];//日程提醒队列
  _timer01:any=null;
  constructor(private nativeService: NativeService,
              private httpService: HttpService,
              private toastCtrl: ToastController,
              private app: App,) {
  }

  //通过APP取NavController
  get navController(): NavController {
    return this.app.getRootNav();
  }

  /**
   * 获取日程提醒队列
   * @param userId
   */
  getScheduleRemindList(userId) {
    clearInterval(this._timer01);
    this.httpService.postFormData('/huarui/hrswTCalendarmemorandum/getScheduleRemindList', {USER001: userId}).subscribe(data => {
      if (data.scheduleRemindList.length>0) {
        this._scheduleList = data.scheduleRemindList;
        //初始化日程提示计时器
        this.initTimer();
      }
    });
  }

  //日程提示计时器
  initTimer() {
    //每秒计时器
    this._timer01 = setInterval(() => {
      this.scheduleList.forEach(data=>{
        if(data.CME003N < (new Date()).getTime()){
          this.scheduleList.pop();
        }else if((data.CME003N+1000 >= (new Date()).getTime())&&(data.CME003N-1000 < (new Date()).getTime())){
          this.messageReminding(data);
          this.scheduleList.pop();
        }
      });
    }, '1000');
  }

  get scheduleList(): Array<any> {
    return this._scheduleList;
  }

  set scheduleList(value: Array<any>) {
    this._scheduleList = value;
  }

  //接收到信息提示方法
  messageReminding(data){
    let ctype:string='';
    if(data.CTYPE==0){
      ctype='日程';
    }else if(data.CTYPE==1){
      ctype='会议';
    }else if(data.CTYPE==2){
      ctype='任务';
    }
    let isActive = this.nativeService.isBackgroundActive();
    if(isActive){//判断程序是否在后台
      this.nativeService.notice(ctype+'消息提醒',data.CAME002,{});//通知栏提示信息
    }else{
      //小弹窗提示
      let toast = this.toastCtrl.create({
        message: ctype+'消息提醒:'+data.CAME002,
        duration: 3000,
        position: 'top',
        showCloseButton:true,
        closeButtonText:'前往',
        dismissOnPageChange:true
      });
      toast.onDidDismiss(() => {
        if(data.CTYPE==0){//进入日程详情
          this.navController.push('TodayjobplanPage', {
            CAME001: data.CAME001
          });
        }else if(data.CTYPE==1){//进入会议详情
          this.navController.push('WkmtdetailPage', {
            MEET001: data.CAME001,
            ISTYPE:0
          });
        }else if(data.CTYPE==2){//进入任务详情
          this.navController.push('TaskdetailPage', {
            CALT001: data.CAME001
          });
        }
      });
      toast.present();
    }
    this.nativeService.vibrate(500);//震动0.5秒
    //this.nativeService.preloadSimple();//提示音
  }

}
