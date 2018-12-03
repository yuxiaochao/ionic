import {Component, HostListener, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {ScheduleService} from "../../../../../service/schedule/ScheduleService";
import {Utils} from "../../../../../providers/Utils";

/**
 * Generated class for the PlacerenwPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-placerenw',
  templateUrl: 'placerenw.html',
})
export class PlacerenwPage {

  OrClientY;


  itema1;   //周
  itema2;   //周
  itema3;   //周
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
  clickedTimes: number = 0;


  // items1: any = [];  //月
  // items2: any = [];  //月
  // items3: any = [];  //月
  // i: number;
  // j: number;
  // k: number;
  // kk: number;
  // type: boolean = true;
  // num: boolean = true;


  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              private scheduleService: ScheduleService,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacerenwPage');
    this.weeklyCalendar();

  }

  //---------------------------------------上下左右----------------

  @HostListener('touchstart')
  dealwith1(){
    debugger
    this.OrClientY = event['targetTouches'][0].clientY
  }
  @HostListener('touchend')
  dealwith2(){
    debugger
    if(event['changedTouches'][0].clientY>this.OrClientY){
      console.log('上滑');
    }else if(event['changedTouches'][0].clientY<this.OrClientY){
      console.log('下滑');
    }
  }











  //------------------------------------上下左右----------------------


  weeklyCalendar() {
    /*简化id操作*/
    this.d = new Date();
    this.currDay = this.d.getDay(); //getDay() 方法可返回一周（0~6）的某一天的数字。 星期天为 0, 星期一为 1, 以此类推
    this.currDate = this.d.getDate();
    this.currMonth = this.d.getMonth() + 1;
    this.currYear = this.d.getFullYear();
    console.log('2e')
    this.currMonth < 10 ? this.currMonth = "0" + this.currMonth : this.currMonth;
    this.showyear = this.currYear;
    this.showmonth = this.currMonth;

    this.itema1 = this.changeWeek(this.zzi + 1);//上一周
    this.itema2 = this.changeWeek(this.zzi)
    this.itema3 = this.changeWeek(this.zzi - 1);//下一周
    console.log(this.itema2);
  }

  creatWeekCalendar(some) {
    // console.log('creat')
    let a = [], zhou: any = [], yue: any = [], nian: any = [];
    for (let i = some, len = some + 7; i < len; i++) {
      if (this.calcTime(i).month == this.currMonth && this.calcTime(i).date == this.currDate) {
        // a.push(this.calcTime(i).date)
        zhou.push({
          day: this.calcTime(i).date,
          month: this.calcTime(i).month,
          year: this.calcTime(i).year,
          iscolor: true
        });
        // this.yue.push(this.calcTime(i).month);
        // this.nian.push(this.calcTime(i).year);
        this.zzisday = true;
      } else {
        // a.push(this.calcTime(i).date)
        zhou.push({
          day: this.calcTime(i).date,
          month: this.calcTime(i).month,
          year: this.calcTime(i).year,
          iscolor: false
        });
        // yue.push(this.calcTime(i).month);
        // nian.push(this.calcTime(i).year);
        this.zzisday = false;
      }
    }
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
    // console.log('2f')
    //动态设置月
    // this.showmonth = this.yue[0];
    // // $$('month_selector').innerHTML = clickMonth;
    // this.showyear = this.nian[0];
    // // $$('year_selector').innerHTML = clickYear;
    return this.creatWeekCalendar(-this.currDay - (7 * clickedTimes));
  }

  //右滑
  ZhouslideNext() {
    if (this.Zhoutype) {
      this.Zhoutype = false;
      return;
    }
    console.log('右滑');

    // 3 4 2
    let thisIndex = this.slides.getActiveIndex();
    console.log(thisIndex);
    this.zzi = this.zzi - 1;

    let arr;
    arr = this.changeWeek(this.zzi - 1);//下一周;
    if (thisIndex == 2) {
      this.itema3 = arr;
      this.showyear = this.itema2[0].year
      this.showmonth = this.itema2[0].month
    } else if (thisIndex == 3) {
      this.itema1 = arr;
      this.showyear = this.itema3[0].year
      this.showmonth = this.itema3[0].month
    } else if (thisIndex == 4) {
      this.Zhoutype = true;
      this.slides.slideTo(1, 0);
      this.itema2 = arr;
      this.showyear = this.itema1[0].year
      this.showmonth = this.itema1[0].month
    }
  }

  //左滑
  ZhouslidePrev() {
    if (this.Zhoutype) {
      this.Zhoutype = false;
      return;
    }
    console.log('左滑');

    // 1 0 2
    let thisIndex = this.slides.getActiveIndex();
    console.log(thisIndex);
    this.zzi = this.zzi + 1;

    let arr;
    arr = this.changeWeek(this.zzi + 1);//上一周;
    if (thisIndex == 2) {
      this.itema1 = arr;
      this.showyear = this.itema2[0].year
      this.showmonth = this.itema2[0].month
    } else if (thisIndex == 0) {
      this.Zhoutype = true;
      this.slides.slideTo(3, 0);
      this.itema2 = arr;
      this.showyear = this.itema3[0].year
      this.showmonth = this.itema3[0].month
    } else if (thisIndex == 1) {
      this.itema3 = arr;
      this.showyear = this.itema1[0].year
      this.showmonth = this.itema1[0].month
    }
  }









//  ----------------------------------------月日历---------------------------------------------

}
