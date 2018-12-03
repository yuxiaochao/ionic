import {Component, Input, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {Topic} from "../../../../model/Topic";
import {ScheduleService} from "../../../../service/schedule/ScheduleService";
import {GlobalData} from "../../../../providers/GlobalData";
import {CommonService} from "../../../../service/CommonService";


@IonicPage()
@Component({
  selector: 'page-full-calendar',
  templateUrl: 'full-calendar.html',
})
export class FullCalendarPage {

  @Input()i: number;
  @Input()j: number;
  @Input()k: number;
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private scheduleService: ScheduleService,
              public globalData: GlobalData,
              public commonService: CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullCalendarPage');
  }

  //右滑
  // slideNext() {
  //   if (this.type) {
  //     this.type = false;
  //     return;
  //   }
  //   let thisIndex = this.slides.getActiveIndex();
  //   console.log(thisIndex);
  //   this.j = this.j + 1;
  //   if (this.j == 13) {
  //     this.j = 1;
  //     this.i += 1;
  //   }
  //
  //   if (thisIndex == 2) {
  //     //this.items3 = arr;
  //     this.calendar(this.i, this.j + 1, this.k, 3);
  //   } else if (thisIndex == 3) {
  //     //this.items1 = arr;
  //     this.calendar(this.i, this.j + 1, this.k, 1);
  //   } else if (thisIndex == 4) {
  //     this.type = true;
  //     this.slides.slideTo(1, 0);
  //     //this.items2 = arr;
  //     this.calendar(this.i, this.j + 1, this.k, 2);
  //   }
  //   let selectDate: Date = new Date(this.i, this.j - 1, this.k);
  //   this.globalData.showLoading = false;
  //   this.initScheduleList(selectDate);
  //   this.globalData.showLoading = true;
  //   this.num = false;
  // }
  //
  // //左滑
  // slidePrev() {
  //   if (this.type) {
  //     this.type = false;
  //     return;
  //   }
  //   let thisIndex = this.slides.getActiveIndex();
  //   console.log(thisIndex);
  //   this.j = this.j - 1;
  //   if (this.j == 0) {
  //     this.j = 12;
  //     this.i -= 1;
  //   }
  //   if (thisIndex == 2) {
  //     //this.items1 = arr;
  //     this.calendar(this.i, this.j - 1, this.k, 1);
  //   } else if (thisIndex == 0) {
  //     this.type = true;
  //     this.slides.slideTo(3, 0);
  //     //this.items2 = arr;
  //     this.calendar(this.i, this.j - 1, this.k, 2);
  //   } else if (thisIndex == 1) {
  //     //this.items3 = arr;
  //     this.calendar(this.i, this.j - 1, this.k, 3);
  //   }
  //   let selectDate: Date = new Date(this.i, this.j - 1, this.k);
  //   this.globalData.showLoading = false;
  //   this.initScheduleList(selectDate);
  //   this.globalData.showLoading = true;
  //   this.num = false;
  // }
  //
  //
  // //定义一个calendar函数，返回值是日历数组
  // calendar(i, j, k, item: number) {
  //   let thiss = this;
  //   if (j > 12) {
  //     j = 1;
  //     i += 1;
  //   }
  //   if (j < 1) {
  //     j = 12;
  //     i -= 1;
  //   }
  //   //本月总天数
  //   let thisMonthLength = new Date(i, j, 0).getDate();
  //   //定义数组
  //   let arr = [];
  //   //上个月总天数
  //   let prevMonthLength = new Date(i, j - 1, 0).getDate();
  //   let a = i;
  //   let b = j;
  //   //本月第一天星期几，从而插入上月剩余的天数
  //   let firstDay = new Date(i, j - 1).getDay();
  //   if (b - 1 == 0) {
  //     b = 12;
  //     a = a - 1;
  //   } else {
  //     b = b - 1
  //   }
  //   //插入上月剩余天数
  //   while (firstDay--) {
  //     let Dates = this.scheduleService.getLunarCalendarSolarterms(a, b, prevMonthLength);
  //     let dates1 = Dates.split(',');
  //     let subd: string;
  //     if (dates1[0] == '0') {//公历节日
  //       subd = dates1[1].substring(0, 2);
  //     } else if (dates1[0] == '1') {//公历节日
  //       subd = dates1[1].substring(0, 2);
  //     } else if (dates1[0] == '2') {//节气
  //       subd = dates1[1];
  //     } else if (dates1[0] == '3') {//农历
  //       subd = dates1[1].substring(dates1[1].length - 2, dates1[1].length);
  //       if (subd == '初一') {
  //         subd = dates1[1].substring(dates1[1].length - 4, dates1[1].length - 2);
  //       }
  //     }
  //     arr.unshift({
  //       day: prevMonthLength--,
  //       current: false,
  //       subd: subd
  //     })
  //   }
  //
  //
  //   //定义本月日期计数，并插入本月天数
  //   let count = 1;
  //   let cycles = 0;
  //   let initAllCalendarInfo: any = [];
  //   this.globalData.showLoading = false;
  //   thiss.initAllCalendarInfo(i + '-' + j + '-' + 1).subscribe(data => {
  //     if (data.initAllCalendarInfo) {
  //       initAllCalendarInfo = data.initAllCalendarInfo;
  //       while (thisMonthLength--) {
  //         let Dates = this.scheduleService.getLunarCalendarSolarterms(i, j, count);
  //         let dates1 = Dates.split(',');
  //         let subd: string;
  //         if (dates1[0] == '0') {//公历节日
  //           subd = dates1[1].substring(0, 2);
  //         } else if (dates1[0] == '1') {//公历节日
  //           subd = dates1[1].substring(0, 2);
  //         } else if (dates1[0] == '2') {//节气
  //           subd = dates1[1];
  //         } else if (dates1[0] == '3') {//农历
  //           subd = dates1[1].substring(dates1[1].length - 2, dates1[1].length);
  //           if (subd == '初一') {
  //             subd = dates1[1].substring(dates1[1].length - 4, dates1[1].length - 2);
  //           }
  //         }
  //         if (count == k) {
  //           arr.push({
  //             day: count++,
  //             current: true,
  //             isday: true,
  //             subd: subd,
  //             isShowPoint: initAllCalendarInfo[cycles].FNUM
  //           });
  //         } else {
  //           if (initAllCalendarInfo[cycles]) {
  //             arr.push({
  //               day: count++,
  //               current: true,
  //               isday: false,
  //               subd: subd,
  //               isShowPoint: initAllCalendarInfo[cycles].FNUM
  //             });
  //           } else {
  //             console.log(initAllCalendarInfo);
  //           }
  //         }
  //         cycles++;
  //       }
  //
  //       //判断本月日历数组共有多少天，并补齐下月出现的天数
  //       let d = i;   // 年
  //       let e = j;   // 月
  //       if (e + 1 == 13) {
  //         e = 1;
  //         d = d + 1;
  //       } else {
  //         e = e + 1;
  //       }
  //       count = 1;
  //       while (arr.length != 35 && arr.length != 42) {
  //         let Dates = this.scheduleService.getLunarCalendarSolarterms(d, e, count);
  //         let dates1 = Dates.split(',');
  //         let subd: string;
  //         if (dates1[0] == '0') {//公历节日
  //           subd = dates1[1].substring(0, 2);
  //         } else if (dates1[0] == '1') {//公历节日
  //           subd = dates1[1].substring(0, 2);
  //         } else if (dates1[0] == '2') {//节气
  //           subd = dates1[1];
  //         } else if (dates1[0] == '3') {//农历
  //           subd = dates1[1].substring(dates1[1].length - 2, dates1[1].length);
  //           if (subd == '初一') {
  //             subd = dates1[1].substring(dates1[1].length - 4, dates1[1].length - 2);
  //           }
  //         }
  //         arr.push({
  //           day: count++,
  //           current: false,
  //           subd: subd
  //         })
  //       }
  //       if (item == 1) {
  //         this.items1 = arr;
  //       } else if (item == 2) {
  //         this.items2 = arr;
  //       } else if (item == 3) {
  //         this.items3 = arr;
  //       }
  //
  //     }
  //   });
  //   this.globalData.showLoading = true;
  // }
  //
  // //获取日程列表（默认加载10条）
  // initScheduleList(paramMap?) {
  //   this.showTimeFrame = -1;
  //   this.commonService.getPage('/huarui/hrswTCalendarmemorandum/scheduleList',
  //     {LIMIT: 10, START: 1, nowDate: paramMap}).subscribe(data => {
  //     if (data.scheduleList) {
  //       this.scheduleList = data.scheduleList;
  //       let show = true;
  //       for (let i = 0; i < data.scheduleList.length; i++) {
  //         if (show) {
  //           let item = data.scheduleList[i];
  //           console.log(item.STARTDATE + '----' + new Date().getTime());
  //           if (item.STARTDATE > (new Date()).getTime()) {
  //             this.showTimeFrame = i;
  //             show = false;
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

}
