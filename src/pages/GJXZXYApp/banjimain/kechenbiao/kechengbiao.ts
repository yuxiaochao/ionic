import {Component, ElementRef, ViewChild} from '@angular/core';
import {InfiniteScroll, IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {ScheduleService} from "../../../../service/schedule/ScheduleService";
import {GlobalData} from "../../../../providers/GlobalData";
import {ImplementFun} from "../../../../model/home/online-study/online-study-main/ImplementFun";
import {CommonService} from "../../../../service/CommonService";
import {Utils} from "../../../../providers/Utils";


@IonicPage()
@Component({
  selector: 'page-kechengbiao',
  templateUrl: 'kechengbiao.html',
})
export class KechengbiaoPage {
  chuannian;
  chuanyue;
  chuanri;
  xianzhou: boolean = true;
  xianyue: boolean = false;
  zhouIndex: number = -1;
  //周日历所有数据
  itema1:any=[];   //周
  itema2:any=[];   //周
  itema3:any=[];   //周
  Zhoutype: boolean = true;
  zzisday: boolean = false;
  zzi: number = 0;
  d;
  currDay;
  currDate;
  currMonth;
  currYear;
  showyear;
  showmonth;
  showday;
  clickyuein: number = -1;
  // 月日历所有数据
  hui: string = '#000';
  items1: any = [];
  items2: any = [];
  items3: any = [];
  i: number;
  j: number;
  k: number;
  kk: number;
  app: string = 'red';
  type: boolean = true;
  num: boolean = true;
  a1: boolean = true;
  a2: boolean = true;
  show: boolean = false;
  show1: boolean = false;
  nametigger: string = 'arrow-down';
  nametigger1: string = 'arrow-down';
  selectCourseList: any = [];//日程列表
  _timer01: any;//计时器01
  nowTime: Date = new Date();//当前时间
  meetingList: any = [];//我的会议集合
  taskList: any = [];//任务列表
  showTimeFrame: number = -1;
  start: number = 1;
  selectType: number;
  selectText: string;
  implementFun: Array<ImplementFun> = [];//执行方法集
  @ViewChild('slides1') slides1: Slides;
  @ViewChild('slides2') slides2: Slides;
  @ViewChild('barrage') barrage: ElementRef;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private scheduleService: ScheduleService,
              public globalData: GlobalData,
              public commonService: CommonService) {
  }

  ionViewDidEnter() {
    //周日历开始
    this.weeklyCalendar();
    // 月日历开始
    this.initDate();//初始日历
    this.implementFun.push({
      functionName: "calendar",
      functionParam: [this.i, this.j - 1, this.k, 1]
    });//初始上一个月日历
    this.implementFun.push({
      functionName: "calendar",
      functionParam: [this.i, this.j, this.k, 2]
    });//初始本月日历
    this.implementFun.push({
      functionName: "calendar",
      functionParam: [this.i, this.j + 1, this.k, 3]
    });//初始下一个月日历
    this.implementFun.push({functionName: "initCourseList", functionParam: [this.i, this.j - 1, this.k]});//初始计时器
    this.runImplementFun();//开始执行加载方法
  }

  initDate() {
    let sj = Utils.dateFormat(new Date(), 'yyyy-MM-dd');
    let dateitems = sj.split('-');
    this.i = parseInt(dateitems[0]);//年
    this.j = parseInt(dateitems[1]);//月
    this.k = parseInt(dateitems[2]);//日
    this.kk = parseInt(dateitems[2]);
    this.nametigger = 'arrow-down';
    this.selectText = '';
    this.show = false;
  }

  initAllCalendarInfo(param) {
    return this.commonService.getPage('/huarui/hrswTCalendarmemorandum/initAllCalendarInfo', {thisTime: param});
  }

  // 周日历去除蓝色点点
  initAllCalendarWeekInfo(param) {
    return this.commonService.getPage('/huarui/hrswTCalendarmemorandum/initAllCalendarWeekInfo', {thisTime: param});
  }

  //获取课程列表（默认加载10条）
  initCourseList(i, j, k, param?) {
    let selectDate: Date = new Date(i, j, k);
    this.showTimeFrame = -1;
    this.globalData.showLoading = false;
    this.commonService.getPage('/huarui/xzxyTTrainingcourse/selectCourseList',
      {LIMIT: 10, START: 1, nowDate: selectDate}).subscribe(data => {
      this.globalData.showLoading = true;
      if (data.selectCourseList) {
        this.selectCourseList = data.selectCourseList;
        let show = true;
        for (let i = 0; i < data.selectCourseList.length; i++) {
          if (show) {
            let item = data.selectCourseList[i];
            //console.log(item.STARTDATE + '----' + new Date().getTime());
            if (item.STARTDATE > (new Date()).getTime()) {
              this.showTimeFrame = i;
              show = false;
            }
          }
        }
        if (param && param.callback) {
          param.callback();
        }//回调函数
      }
    });
  }

  //初始化计时器
  initTimer() {
    //每秒计时器
    this._timer01 = setInterval(() => {
      this.nowTime = new Date();
      let show = true;
      for (let i = 0; i < this.selectCourseList.length; i++) {
        if (show) {
          let item = this.selectCourseList[i];
          if (item.STARTDATE > (new Date()).getTime()) {
            this.showTimeFrame = i;
            show = false;
          }
        }
      }
    }, '1000');
  }

  //加载执行顺序
  runImplementFun(implementFun?: Array<ImplementFun>): void {
    if (!implementFun) {
      implementFun = this.implementFun;
    }
    if (implementFun.length == 0) {
      return;
    }
    let iFun = implementFun.shift();//取数组第一位
    let funname = iFun.functionName;
    let fupram = iFun.functionParam;
    let sync = iFun.synchronization == undefined ? true : iFun.synchronization;//如果undefined默认true
    let param: any = [];
    if (fupram) {
      fupram.forEach(data => {
        param.push(data);
      });
    }
    if (sync) {
      //同步执行方法
      this[funname](...param, {
        callback: () => {
          this.runImplementFun(implementFun);
        }
      });
    } else {
      //异步执行方法
      this[funname](param);
      this.runImplementFun(implementFun);
    }
  }

  zhouSelectedClick(index, item) {
    this.showmonth = item.month;
    this.showyear = item.year;
    this.showday = item.day;
    this.clickyuein = item.day;
    this.zhouIndex = index;
    this.itema1.forEach(data => {
      data.iscolor = false
    });
    this.itema2.forEach(data => {
      data.iscolor = false
    });
    this.itema3.forEach(data => {
      data.iscolor = false
    });
    this.itema1[index].iscolor = true;
    this.itema2[index].iscolor = true;
    this.itema3[index].iscolor = true;
    this.chuannian = this.showyear;
    this.chuanyue = this.showmonth;
    this.chuanri = this.showday;

    this.initCourseList(this.chuannian, this.chuanyue - 1, this.chuanri);
  }

  // 下滑显示月日历隐藏周日历
  xianyuetodo() {
    this.type = false;
    this.i = this.showyear;
    this.j = this.showmonth;
    this.kk = this.showday;
    this.chuannian = this.i;
    this.chuanyue = this.j;
    this.chuanri = this.kk;
    this.xianyue = true;
    this.xianzhou = false;
  }

  //上滑显示周日历，隐藏月日历
  xianzhoutodo() {
    this.Zhoutype = false;
    this.showyear = this.i;
    this.showmonth = this.j;
    this.showday = this.kk;
    this.d = new Date(this.showyear, this.showmonth - 1, this.showday);
    this.currDay = this.d.getDay(); //getDay() 方法可返回一周（0~6）的某一天的数字。 星期天为 0, 星期一为 1, 以此类推
    this.zhouIndex = this.currDay;
    this.currDate = this.d.getDate();
    this.currMonth = this.d.getMonth() + 1;
    this.currYear = this.d.getFullYear();
    console.log('2e')
    //this.currMonth < 10 ? this.currMonth = "0" + this.currMonth : this.currMonth;
    this.showyear = this.currYear;
    this.showmonth = this.currMonth;
    this.showday = this.currDate;

    this.zzi = 0;
    this.itema1 = this.changeWeek(this.zzi + 1);//上一周
    this.itema2 = this.changeWeek(this.zzi);
    this.itema3 = this.changeWeek(this.zzi - 1);//下一周
    this.xianzhou = true;
    this.xianyue = false;
  }

  //----------------------------------周日历开始-------------------------------

  weeklyCalendar(date?:any) {
    /*简化id操作*/
    this.d = new Date();
    if(date){
      this.d = date;
    }
    this.currDay = this.d.getDay(); //getDay() 方法可返回一周（0~6）的某一天的数字。 星期天为 0, 星期一为 1, 以此类推
    this.zhouIndex = this.currDay;
    this.currDate = this.d.getDate();
    this.currMonth = this.d.getMonth() + 1;
    this.currYear = this.d.getFullYear();
    //this.currMonth < 10 ? this.currMonth = "0" + this.currMonth : this.currMonth;
    this.showyear = this.currYear;
    this.showmonth = this.currMonth;
    this.showday = this.currDate;
    this.chuannian = this.showyear;
    this.chuanyue = this.showmonth;
    this.chuanri = this.showday;
    this.itema1 = this.changeWeek(this.zzi + 1);//上一周
    this.itema2 = this.changeWeek(this.zzi);
    this.itema3 = this.changeWeek(this.zzi - 1);//下一周
    console.log(this.itema2);
  }


  creatWeekCalendar(some) {
    let a = [], zhou: any = [], yue: any = [], nian: any = [];
    let jj = 0;

    let suop = 0;
    let zhoupointtems: any = [];
    let obj = this.calcTime(some);
    let parm = obj.year + '-' + obj.month + '-' + obj.date;
    this.globalData.showLoading = false;
    //this.initAllCalendarWeekInfo(parm).subscribe(data => {
      this.globalData.showLoading=true;
      //zhoupointtems = data.initAllCalendarWeekInfo;
      for (let i = some, len = some + 7; i < len; i++) {
        let Dates = this.scheduleService.getLunarCalendarSolarterms(this.calcTime(i).year, this.calcTime(i).month, this.calcTime(i).date);
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
        if (this.zhouIndex == jj) {
          zhou.push({
            day: this.calcTime(i).date,
            month: this.calcTime(i).month,
            year: this.calcTime(i).year,
            iscolor: true,
            nong: subd,
            //Showzhoupoint: zhoupointtems[suop].FNUM
          });
          this.zzisday = true;
        } else if ((this.calcTime(i).month == this.currMonth && this.calcTime(i).date == this.currDate)) {
          if (this.zhouIndex == -1) {
            zhou.push({
              day: this.calcTime(i).date,
              month: this.calcTime(i).month,
              year: this.calcTime(i).year,
              iscolor: true,
              nong: subd,
              //Showzhoupoint: zhoupointtems[suop].FNUM
            });
          } else {
            zhou.push({
              day: this.calcTime(i).date,
              month: this.calcTime(i).month,
              year: this.calcTime(i).year,
              iscolor: false,
              nong: subd,
              //Showzhoupoint: zhoupointtems[suop].FNUM
            });
            this.zzisday = true;
          }

        } else {
          zhou.push({
            day: this.calcTime(i).date,
            month: this.calcTime(i).month,
            year: this.calcTime(i).year,
            iscolor: false,
            nong: subd,
            //Showzhoupoint: zhoupointtems[suop].FNUM
          });
          this.zzisday = false;
        }
        jj++;
        suop++;
      }
    //});
    if (zhou.length > 7) {
      zhou.splice(0, 7)
    }

    return zhou;  //周日历的七项日期

  }

  calcTime(num1) {
    // console.log('2b')
    let num = num1 || 0,
      someTime = this.d.getTime() + (24 * 60 * 60 * 1000) * num,
      someYear = new Date(someTime).getFullYear(),
      someMonth = new Date(someTime).getMonth() + 1,  //未来月
      someDate = new Date(someTime).getDate();  //未来天
    let obj = {
      "year": someYear,
      "month": someMonth,
      "date": someDate
    };
    // console.log(obj.date + '-----------------')
    return obj;
  }

  changeWeek(clickedTimes) {
    return this.creatWeekCalendar(-this.currDay - (7 * clickedTimes));
  }

  //右滑
  zhouSlideNext() {
    if(!this.xianzhou){
      return;
    }
    if (this.Zhoutype) {
      this.Zhoutype = false;
      return;
    }
    console.log('右滑');     // 3 4 2
    let thisIndex = this.slides2.getActiveIndex();
    console.log(thisIndex);
    this.zzi = this.zzi - 1;
    let arr;
    //arr = this.changeWeek(this.zzi - 1);//下一周;
    if (thisIndex == 2) {
      this.itema2.forEach(data => {
        if (data.iscolor) {
          this.showmonth = data.month;
          this.showyear = data.year;
          this.showday = data.day;
        }
      });
      this.itema3 = this.changeWeek(this.zzi - 1);//下一周;
      // this.showmonth = this.itema2[0].month
    } else if (thisIndex == 3) {
      this.itema3.forEach(data => {
        if (data.iscolor) {
          this.showmonth = data.month;
          this.showyear = data.year
          this.showday = data.day;
        }
      });
      this.itema1 = this.changeWeek(this.zzi - 1);//下一周;
    } else if (thisIndex == 4) {
      this.Zhoutype = true;
      this.slides2.slideTo(1, 0);
      this.itema1.forEach(data => {
        if (data.iscolor) {
          this.showmonth = data.month;
          this.showyear = data.year
          this.showday = data.day;
        }
      });
      this.itema2 = this.changeWeek(this.zzi - 1);//下一周;;
    }
    this.chuannian = this.showyear;
    this.chuanyue = this.showmonth;
    this.chuanri = this.showday;
    this.calendar(this.chuannian, this.chuanyue - 1, this.chuanri, 1);
    this.calendar(this.chuannian, this.chuanyue, this.chuanri, 2);
    this.calendar(this.chuannian, this.chuanyue + 1, this.chuanri, 3);
    this.initCourseList(this.chuannian, this.chuanyue - 1, this.chuanri);
  }

  //左滑
  zhouSlidePrev() {
    if(!this.xianzhou){
      return
    }
    if (this.Zhoutype) {
      this.Zhoutype = false;
      return;
    }
    console.log('左滑');
    // 1 0 2
    let thisIndex = this.slides2.getActiveIndex();
    console.log(thisIndex);
    this.zzi = this.zzi + 1;

    let arr;
    arr = this.changeWeek(this.zzi + 1);//上一周;
    if (thisIndex == 2) {
      this.itema1 = arr;
      this.itema2.forEach(data => {
        if (data.iscolor) {
          this.showmonth = data.month;
          this.showyear = data.year;
          this.showday = data.day;
        }
      });
    } else if (thisIndex == 0) {
      this.Zhoutype = true;
      this.slides2.slideTo(3, 0);
      this.itema2 = arr;
      this.itema3.forEach(data => {
        if (data.iscolor) {
          this.showmonth = data.month;
          this.showyear = data.year;
          this.showday = data.day;
        }
      });
    } else if (thisIndex == 1) {
      this.itema3 = arr;
      this.itema1.forEach(data => {
        if (data.iscolor) {
          this.showmonth = data.month;
          this.showyear = data.year;
          this.showday = data.day;
        }
      });
    }
    this.chuannian = this.showyear;
    this.chuanyue = this.showmonth;
    this.chuanri = this.showday;
    this.calendar(this.chuannian, this.chuanyue - 1, this.chuanri, 1);
    this.calendar(this.chuannian, this.chuanyue, this.chuanri, 2);
    this.calendar(this.chuannian, this.chuanyue + 1, this.chuanri, 3);
    this.initCourseList(this.chuannian, this.chuanyue - 1, this.chuanri);
  }

  /*--------------------------月日历开始--------------------*/

  //重置
  getnl() {
    this.ionViewDidEnter();
    this.type = true;
    this.slides1.slideTo(2, 1000);
    this.slides2.slideTo(2, 1000);
  }

  //右滑
  slideNext() {
    if(!this.xianyue){
      return;
    }
    if (this.type) {
      this.type = false;
      return;
    }
    console.log('月右滑')
    let thisIndex = this.slides1.getActiveIndex();
    console.log(thisIndex);
    this.j = this.j + 1;
    if (this.j == 13) {
      this.j = 1;
      this.i += 1;
    }

    if (thisIndex == 2) {
      this.calendar(this.i, this.j + 1, this.k, 3);
    } else if (thisIndex == 3) {
      this.calendar(this.i, this.j + 1, this.k, 1);
    } else if (thisIndex == 4) {
      this.type = true;
      this.slides1.slideTo(1, 0);
      this.calendar(this.i, this.j + 1, this.k, 2);
    }
    this.initCourseList(this.i, this.j - 1, this.k);
    this.num = false;
    this.chuannian = this.i;
    this.chuanyue = this.j;
    this.chuanri = this.kk;
    let date:Date = new Date(this.chuannian+'-'+this.chuanyue+'-'+this.chuanri);
    this.weeklyCalendar(date);
  }

  //左滑
  slidePrev() {
    if(!this.xianyue){
      return;
    }
    if (this.type) {
      this.type = false;
      return;
    }
    console.log('月左滑')
    let thisIndex = this.slides1.getActiveIndex();
    console.log(thisIndex);
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
      this.slides1.slideTo(3, 0);
      //this.items2 = arr;
      this.calendar(this.i, this.j - 1, this.k, 2);
    } else if (thisIndex == 1) {
      //this.items3 = arr;
      this.calendar(this.i, this.j - 1, this.k, 3);
    }
    this.initCourseList(this.i, this.j - 1, this.k);
    this.num = false;
    this.chuannian = this.i;
    this.chuanyue = this.j;
    this.chuanri = this.kk;
    let date:Date = new Date(this.chuannian+'-'+this.chuanyue+'-'+this.chuanri);
    this.weeklyCalendar(date);
  }

  //定义一个calendar函数，返回值是日历数组
  calendar(i, j, k, item: number, param?) {
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
    this.globalData.showLoading = false;
    //thiss.initAllCalendarInfo(i + '-' + j + '-' + 1).subscribe(data => {
      this.globalData.showLoading = true;
      //if (data.initAllCalendarInfo) {
        //initAllCalendarInfo = data.initAllCalendarInfo;
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
          if (count == this.clickyuein) {
            arr.push({
              day: count++,
              current: true,
              isday: true,
              subd: subd,
              //isShowPoint: initAllCalendarInfo[cycles].FNUM
            });
          } else if (count == k && this.clickyuein == -1) {
            arr.push({
              day: count++,
              current: true,
              isday: true,
              subd: subd,
              //isShowPoint: initAllCalendarInfo[cycles].FNUM
            });
          } else {
            arr.push({
              day: count++,
              current: true,
              isday: false,
              subd: subd,
              //isShowPoint: initAllCalendarInfo[cycles].FNUM
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
      //}
      if (param && param.callback) {
        param.callback();
      }//回调函数
    //});
    this.globalData.showLoading = true;
  }

  selectedDate(item, type: number) {
    this.showday = -1;
    this.clickyuein = item.day;
    if (!item.current) {
      return;
    }

    this.items1.forEach(data => {
      data.isday = item.day == data.day
    });
    this.items2.forEach(data => {
      data.isday = item.day == data.day
    });
    this.items3.forEach(data => {
      data.isday = item.day == data.day
    });

    this.infiniteScroll.enable(true);
    this.kk = item.day;
    this.initCourseList(this.i, this.j - 1, item.day);
    this.chuannian = this.i;
    this.chuanyue = this.j;
    this.chuanri = this.kk;
  }


}
