import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  InfiniteScroll,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {Utils} from "../../../providers/Utils";
import {ScheduleService} from "../../../service/schedule/ScheduleService";
import {Observable} from "rxjs";
import {NativeService} from "../../../providers/NativeService";
import {GlobalData} from "../../../providers/GlobalData";

/**
 * Generated class for the AttendanceCheckinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendance-checkin',
  templateUrl: 'attendance-checkin.html',
})
export class AttendanceCheckinPage {

  attendancePlan: any = {};//出勤计划
  flage: number;//标记
  timeall = [];
  signInTime: Date;//上班签到时间
  signOutTime: Date;//下班时间
  sign = false;
  hui: string = '#000';
  items1: any = [];
  items2: any = [];
  items3: any = [];
  i: number;
  j: number;
  k: number;
  kk: number;
  groue: number = 1;
  type: boolean = true;
  num: boolean = true;
  a1: boolean = true;
  a2: boolean = true;
  show: boolean = false;
  scheduleList: any = [];//日程列表
  _timer01: any;//计时器01
  nowTime: Date = new Date();//当前时间
  meetingList: any = [];//我的会议集合
  taskList: any = [];//任务列表
  start: number = 1;
  actionSheet: any;//类型选择器
  onWork: any = [];//上班签到
  offWork: any = [];//下班签到
  isNowaday = (Utils.dateFormat(new Date(), 'yyyy-MM-dd')).split('-');
  firstLoad: boolean = true;
  @ViewChild(Slides) slides: Slides;
  @ViewChild('slides1') slides1: any;
  @ViewChild('barrage') barrage: ElementRef;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  /*----高德定位参数---*/
  zb: string;//经纬度字符串“，”隔开
  address: string;//定位地址
  longitude: any;//经度
  latitude: any;//纬度
  BLongitude: any;//基础经度
  BLatitude: any;//基础纬度
  accuracy: string;//范围

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private scheduleService: ScheduleService,
              public commonService: CommonService,
              public alert: AlertController,
              public loadingCtrl: LoadingController,
              public nativeService: NativeService,
              public alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController,
              public globalData: GlobalData,) {
  }

  ionViewDidLoad() {
    /*--------------月日历--------*/
    let sj = Utils.dateFormat(new Date(), 'yyyy-MM-dd');
    let dateitems = sj.split('-');
    this.i = parseInt(dateitems[0]);//年
    this.j = parseInt(dateitems[1]);//月
    this.k = parseInt(dateitems[2]);//日
    this.kk = parseInt(dateitems[2]);
    this.groue = 0;
    this.calendar(this.i, this.j - 1, this.k, 1);
    this.calendar(this.i, this.j, this.k, 2);
    this.calendar(this.i, this.j + 1, this.k, 3);
    this.initData({thisTime: this.i + '-' + this.j + '-' + this.k});
    //this.initTimer();
  }

  //初始化计时器
  // initTimer() {
  //   //每秒计时器
  //   this._timer01 = setInterval(() => {
  //     this.nowTime = new Date();
  //         this.H < 10 ? this.H= '0'+this.H:this.H;
  //         this.M < 10 ? this.M= '0'+this.M:this.M;
  //         this.S < 10 ? this.S= '0'+this.S:this.S;
  //   }, '1000');
  // }

  /*----------------------------------------月日历开始-------------------------------------------*/

  //TODO 接口需修改
  //查询选中日期的打卡记录
  initAllCalendarInfo(param) {
    return this.commonService.getPage('/huarui/hrswTAttendanceplan/getAllSign', {thisTime: param});
  }

  //右滑
  slideNext() {
    if (this.type) {
      this.type = false;
      return;
    }
    let thisIndex = this.slides.getActiveIndex();
    this.j = this.j + 1;
    if (this.j == 13) {
      this.j = 1;
      this.i += 1;
    }
    if (thisIndex == 2) {
      //this.items3 = arr;
      this.calendar(this.i, this.j + 1, this.k, 3);
    } else if (thisIndex == 3) {
      //this.items1 = arr;
      this.calendar(this.i, this.j + 1, this.k, 1);
    } else if (thisIndex == 4) {
      this.type = true;
      this.slides.slideTo(1, 0);
      //this.items2 = arr;
      this.calendar(this.i, this.j + 1, this.k, 2);
    }
    let selectDate: Date = new Date(this.i, this.j - 1, this.k);
    this.num = false;

  }

  //左滑
  slidePrev() {
    if (this.type) {
      this.type = false;
      return;
    }
    let thisIndex = this.slides.getActiveIndex();
    this.j = this.j - 1;
    if (this.j == 0) {
      this.j = 12;
      this.i -= 1;
    }
    if (thisIndex == 2) {
      //this.items1 = arr;
      this.calendar(this.i, this.j - 1, this.k, 1);
    } else if (thisIndex == 0) {
      this.type = true;
      this.slides.slideTo(3, 0);
      //this.items2 = arr;
      this.calendar(this.i, this.j - 1, this.k, 2);
    } else if (thisIndex == 1) {
      //this.items3 = arr;
      this.calendar(this.i, this.j - 1, this.k, 3);
    }
    let selectDate: Date = new Date(this.i, this.j - 1, this.k);
    this.num = false;
  }


  //定义一个calendar函数，返回值是日历数组
  calendar(i, j, k, item: number) {
    let thiss = this;
    if (j > 12) {
      j = 1;
      i += 1;
    }
    if (j < 1) {
      j = 12;
      i -= 1;
    }
    //本月总天数
    let thisMonthLength = new Date(i, j, 0).getDate();
    //定义数组
    let arr = [];
    //上个月总天数
    let prevMonthLength = new Date(i, j - 1, 0).getDate();
    let a = i;
    let b = j;
    //本月第一天星期几，从而插入上月剩余的天数
    let firstDay = new Date(i, j - 1).getDay();
    if (b - 1 == 0) {
      b = 12;
      a = a - 1;
    } else {
      b = b - 1
    }
    //插入上月剩余天数
    while (firstDay--) {
      let Dates = this.scheduleService.getLunarCalendarSolarterms(a, b, prevMonthLength);
      let dates1 = Dates.split(',');
      let subd: string;
      if (dates1[0] == '0') {//公历节日
        subd = dates1[1].substring(0, 2);
      } else if (dates1[0] == '1') {//公历节日
        subd = dates1[1].substring(0, 2);
      } else if (dates1[0] == '2') {//节气
        subd = dates1[1];
      } else if (dates1[0] == '3') {//农历
        subd = dates1[1].substring(dates1[1].length - 2, dates1[1].length);
        if (subd == '初一') {
          subd = dates1[1].substring(dates1[1].length - 4, dates1[1].length - 2);
        }
      }
      arr.unshift({
        day: prevMonthLength--,
        current: false,
        subd: subd
      })
    }


    //定义本月日期计数，并插入本月天数
    let count = 1;
    let cycles = 0;
    let initAllCalendarInfo: any = [];
    thiss.globalData.showLoading = false;
    thiss.initAllCalendarInfo(i + '-' + j + '-' + 1).subscribe(data => {
      thiss.globalData.showLoading = true;
      if (data.initAllCalendarInfo) {
        initAllCalendarInfo = data.initAllCalendarInfo;
        while (thisMonthLength--) {
          let Dates = this.scheduleService.getLunarCalendarSolarterms(i, j, count);
          let dates1 = Dates.split(',');
          let subd: string;
          if (dates1[0] == '0') {//公历节日
            subd = dates1[1].substring(0, 2);
          } else if (dates1[0] == '1') {//公历节日
            subd = dates1[1].substring(0, 2);
          } else if (dates1[0] == '2') {//节气
            subd = dates1[1];
          } else if (dates1[0] == '3') {//农历
            subd = dates1[1].substring(dates1[1].length - 2, dates1[1].length);
            if (subd == '初一') {
              subd = dates1[1].substring(dates1[1].length - 4, dates1[1].length - 2);
            }
          }
          if (count == k) {
            arr.push({
              day: count++,
              current: true,
              isday: true,
              subd: subd,
              isShowPoint: initAllCalendarInfo[cycles].FNUM,//有签到
              isunusual: initAllCalendarInfo[cycles].ISUNUSUAL,//有早退，迟到
              isnormal: initAllCalendarInfo[cycles].ISNORMAL//有加班
            });
          } else {
            arr.push({
              day: count++,
              current: true,
              isday: false,
              subd: subd,
              isShowPoint: initAllCalendarInfo[cycles].FNUM,
              isunusual: initAllCalendarInfo[cycles].ISUNUSUAL,
              isnormal: initAllCalendarInfo[cycles].ISNORMAL
            });

          }
          cycles++;
        }

        //判断本月日历数组共有多少天，并补齐下月出现的天数
        let d = i;   // 年
        let e = j;   // 月
        if (e + 1 == 13) {
          e = 1;
          d = d + 1;
        } else {
          e = e + 1;
        }
        count = 1;
        while (arr.length != 35 && arr.length != 42) {
          let Dates = this.scheduleService.getLunarCalendarSolarterms(d, e, count);
          let dates1 = Dates.split(',');
          let subd: string;
          if (dates1[0] == '0') {//公历节日
            subd = dates1[1].substring(0, 2);
          } else if (dates1[0] == '1') {//公历节日
            subd = dates1[1].substring(0, 2);
          } else if (dates1[0] == '2') {//节气
            subd = dates1[1];
          } else if (dates1[0] == '3') {//农历
            subd = dates1[1].substring(dates1[1].length - 2, dates1[1].length);
            if (subd == '初一') {
              subd = dates1[1].substring(dates1[1].length - 4, dates1[1].length - 2);
            }
          }
          arr.push({
            day: count++,
            current: false,
            subd: subd
          })
        }
        if (item == 1) {
          this.items1 = arr;
        } else if (item == 2) {
          this.items2 = arr;
        } else if (item == 3) {
          this.items3 = arr;
        }
      }
    });
  }

  selectedDate(item) {
    this.items1.forEach(data => {
      data.isday = item.day == data.day
    });
    this.items2.forEach(data => {
      data.isday = item.day == data.day
    });
    this.items3.forEach(data => {
      data.isday = item.day == data.day
    });
    this.kk = item.day;
    this.k = item.day;
    this.initData({thisTime: this.i + '-' + this.j + '-' + this.k})
  }

  //重置
  getnl() {
    this.ionViewDidLoad();
    this.type = true;
    this.slides.slideTo(2, 1000);
  }

  /*---------------------------------------月日历结束-----------------------------------------*/


  initInfo(paramMap?) {
    return this.commonService.getPage('/huarui/hrswTAttendanceplan/attendancePlan', paramMap);
  }

  initData(paramMap?) {
    this.initInfo(paramMap).subscribe(data => {
      if (data) {
        this.attendancePlan = data.attendancePlan;
        //this.timeall = data.timeAll;
        this.onWork = data.onWork;
        this.offWork = data.offWork;
        if (this.attendancePlan) {
          //判断是否签到
          if (this.onWork && this.offWork) {//都签到
            this.signInTime = this.onWork['MTSI005'];
            this.signOutTime = this.offWork['MTSI005'];
          } else if (this.onWork && !this.offWork) {//上班签到
            this.signInTime = this.onWork['MTSI005'];
            this.signOutTime = undefined;
          } else if (!this.onWork && this.offWork) {//下班签到
            this.signInTime = undefined;
            this.signOutTime = this.offWork['MTSI005'];
          } else {//上下班都没签到
            this.signInTime = undefined;
            this.signOutTime = undefined;
          }
          let thisDay: Date = new Date(paramMap.thisTime);
          this.flage = this.attendancePlan[
          'ATPL0' + ((5 + thisDay.getDay()) < 10
            ? '0' + (5 + thisDay.getDay())
            : (5 + thisDay.getDay()))
          ];//取出今天需不需要签到
          let atpl005 = this.attendancePlan['ATPL005'];
          if ((this.flage == 0 && this.firstLoad) || atpl005 == 4) {
            this.firstLoad = false;
            this.alert.create({
              title: '今天不需要签到！',
              buttons: [{
                text: '确定',
                handler: () => {
                  //this.navCtrl.pop();
                }
              }]
            }).present()
          }
        } else if (this.firstLoad) {
          this.firstLoad = false;
          this.alert.create({
            title: '暂时没有出勤签到计划！',
            buttons: [{
              text: '确定',
              handler: () => {
                //this.navCtrl.pop();
              }
            }]
          }).present();
        }
      }
    });
  }

  /**
   * @param type 0,上班签到 1,下班签到
   * @constructor
   */
  normalSignIn(type) {
    //TODO 调用接口获取PC端配置的机构基础定位坐标、精确度
    let accuracy = this.attendancePlan.ATPL019;//10米
    //基础点坐标
    let baseLongitude_latitude: string = this.attendancePlan.ATPL018;
    let position = baseLongitude_latitude.split(',');
    //获取两点之间的差值
    let difference = Utils.getDistance(this.latitude, this.longitude, position[1], position[0]);//差值
    if (parseFloat(difference) >= accuracy) {
      this.BLongitude = position[0];
      this.BLatitude = position[1];
      this.accuracy = accuracy;
      let alert = this.alertCtrl.create({
        message: '您当前的位置不在打卡范围内是否打开地图查看器？',
        buttons: [
          {
            text: '取消',
            handler: () => {
            }
          },
          {
            text: '确定',
            handler: () => {
              this.creatTypeSelector(type);
            }
          }
        ]
      });
      alert.present();
    } else {
      //正式需解开
      let mtsi008 = 0;
      let minutes: number;
      let title = '程序报错了啊！';
      if (type == 3) {//上班签到
        title = '上班签到成功';
        minutes = AttendanceCheckinPage.timeDifference(this.attendancePlan.ATPL013);
        if (minutes > 0) {//早到
          mtsi008 = 1;
        } else if (minutes == 0) {//正常
          mtsi008 = 0;
        } else {//迟到了
          mtsi008 = 2;
          minutes = Math.abs(minutes);
        }
      } else if (type == 4) {
        title = '下班签到成功';
        minutes = AttendanceCheckinPage.timeDifference(this.attendancePlan.ATPL014);
        if (minutes > 0) {//早退
          mtsi008 = 3;
          this.navCtrl.push('OutsideSigninPage', {
            typeTitle: '早退打卡',
            MTSI002: this.attendancePlan.ATPL001,
            MTSI003: type,//3.上班签到  4.下班签到
            MTSI006: this.address,
            MTSI007: this.zb,
            MTSI008: mtsi008,
            MTSI009: minutes,
            TITLE: title,
            callback: () => {
              return new Promise((resolve, reject) => {
                this.initData({thisTime: this.i + '-' + this.j + '-' + this.k});
                resolve();
              });
            },
          });
          return;
        } else if (minutes < 0 && minutes < this.attendancePlan.ATPL022) {//正常
          mtsi008 = 0;
          minutes = Math.abs(minutes);
        } else if (minutes < 0 && minutes > this.attendancePlan.ATPL022) {//加班
          mtsi008 = 4;
          minutes = Math.abs(minutes - this.attendancePlan.ATPL022);
          this.navCtrl.push('OutsideSigninPage', {
            typeTitle: '加班打卡',
            MTSI002: this.attendancePlan.ATPL001,
            MTSI003: type,//3.上班签到  4.下班签到
            MTSI006: this.address,
            MTSI007: this.zb,
            MTSI008: mtsi008,
            MTSI009: minutes,
            TITLE: title,
            callback: () => {
              return new Promise((resolve, reject) => {
                this.initData({thisTime: this.i + '-' + this.j + '-' + this.k});
                resolve();
              });
            },
          });
          return;
        }
      }

      this.commonService.getPage('/huarui/hrswTMeetingtasksignin/signIn', {
        MTSI002: this.attendancePlan.ATPL001,
        MTSI003: type,
        MTSI006: this.address,
        MTSI007: this.zb,
        MTSI008: mtsi008,
        MTSI009: minutes,
        MTSI011: 1
      }).auditTime(500).subscribe(data => {
        if (data.flage) {
          let alert = this.alert.create({
            title: title,
            buttons: [{
              text: '确定',
              handler: () => {
                this.initData({thisTime: this.i + '-' + this.j + '-' + this.k});
                this.sign = true
              }
            }]
          }).present();
        }
      });
    }
  }


  //创建类型选择器
  creatTypeSelector(type) {
    this.actionSheet = this.actionSheetCtrl.create({
      title: '提示',
      buttons: [
        {
          text: '打开地图查看器',
          icon: 'ios-pin',
          role: 'destructive',
          handler: () => {
            this.navCtrl.push('GaodeMapTestPage', {
              BLongitude: this.BLongitude,
              BLatitude: this.BLatitude,
              Longitude: this.longitude,
              Latitude: this.latitude,
              Accuracy: parseFloat(this.accuracy)
            });
          }
        },
        {
          text: '关闭',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    this.actionSheet.present();
  }

  static timeDifference(bTime) {
    let date: Date = new Date();
    let splitDate = bTime.split(':');
    date.setHours(parseInt(splitDate[0]));
    date.setMinutes(parseInt(splitDate[1]));
    let time: number = new Date().getTime();
    //计算出小时数
    return (date.getTime() - time) / (60 * 1000);
  }

}
