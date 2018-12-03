import {Injectable} from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {HttpService} from "../../providers/HttpService";

@Injectable()
export class ScheduleService {

  CalendarData: any = [
    0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957,
    0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD,
    0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A,
    0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95,
    0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57,
    0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6,
    0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A,
    0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5,
    0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B,
    0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F,
    0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6,
    0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55,
    0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A,
    0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B,
    0xA93, 0x40E95
  ];
  sTermInfo:any=[
    0,21208,42467,63836,85337,107014,128867,150921,173149,
    195551,218072,240693,263343,285989,308563,331033,353350,
    375494,397447,419210,440795,462224,483532,504758
  ];
  solarTerm:any=[
    "小寒","大寒",
    "立春","雨水","惊蛰","春分","清明","谷雨",
    "立夏","小满","芒种","夏至","小暑","大暑",
    "立秋","处暑","白露","秋分","寒露","霜降",
    "立冬","小雪","大雪","冬至"
  ];

  //公历节日
  sFtv:any={
     "0101":"元旦", "0214":"情人节", "0308":"妇女节", "0312":"植树节",
     "0315":"消费者权益日", "0401":"愚人节", "0501":"劳动节", "0504":"青年节",
     "0512":"护士节", "0601":"儿童节", "0701":"建党节", "0801":"建军节",
     "0910":"教师节", "0928":"孔子诞辰", "1001":"国庆节", "1006":"老人节",
     "1024":"联合国日", "1224":"平安夜", "1225":"圣诞节"
  };
   //农历节日
   lFtv:any={
    "正月初一":"春节", "正月十五":"元宵节", "五月初五":"端午节",
    "七月初七":"七夕情人节", "七月十五":"中元节", "八月十五":"中秋节",
    "九月初九":"重阳节", "腊月初八":"腊八节", "腊月二十四":"小年"};


  tgString: string = "甲乙丙丁戊己庚辛壬癸";
  dzString: string = "子丑寅卯辰巳午未申酉戌亥";
  numString: string = "一二三四五六七八九十";
  monString: string = "正二三四五六七八九十冬腊";
  sx: string = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
  cYear:any;
  cMonth:any;
  cDay:any;
  TheDate:any;
  madd: any = [];

  constructor(public httpService: HttpService,
              public globalData: GlobalData) {
  }

  /**
   * 获取纯农历
   * @param {number} yy 年
   * @param {number} mm 月
   * @param {number} dd
   * @returns {string}
   */
  getLunarCalendar(yy: number, mm: number, dd: number) {
    if (yy < 100) {
      yy = parseInt("19" + yy);
    }
    this.madd[0] = 0;
    this.madd[1] = 31;
    this.madd[2] = 59;
    this.madd[3] = 90;
    this.madd[4] = 120;
    this.madd[5] = 151;
    this.madd[6] = 181;
    this.madd[7] = 212;
    this.madd[8] = 243;
    this.madd[9] = 273;
    this.madd[10] = 304;
    this.madd[11] = 334;
    return this.GetLunarDay(yy, mm, dd);
  }

  /**
   * 获取农历及节气
   * @param {number} yy 年
   * @param {number} mm 月
   * @param {number} dd
   * @returns {string}
   */
  getLunarCalendarSolarterms(yy: number, mm: number, dd: number) {
    let mmfomat;//公历月
    let ddfomat;//公历日
    let mmfomat1;//农历月
    let ddfomat1;//农历日
    if(mm==0){
      mmfomat="0"+1;
    }else if(mm>0&&mm<10){
      mmfomat="0"+mm;
    }else if(mm>=10&&mm<13){
      mmfomat=""+mm;
    }else{
      mmfomat=""+12;
    }
    if(dd<10){
      ddfomat="0"+dd;
    }else{
      ddfomat=""+dd;
    }
    if (yy < 100) {
      yy = parseInt("19" + yy);
    }
    this.madd[0] = 0;
    this.madd[1] = 31;
    this.madd[2] = 59;
    this.madd[3] = 90;
    this.madd[4] = 120;
    this.madd[5] = 151;
    this.madd[6] = 181;
    this.madd[7] = 212;
    this.madd[8] = 243;
    this.madd[9] = 273;
    this.madd[10] = 304;
    this.madd[11] = 334;
    let lunarDay ='3,'+this.GetLunarDay(yy, mm, dd);
    let lunarDayS = lunarDay.split(' ')
    if(this.lFtv[lunarDayS[1]]){
      let a = this.lFtv[lunarDayS[1]];
      return '0,'+a;
    }
    if(this.sFtv[mmfomat+ddfomat]){
      let a = this.sFtv[mmfomat+ddfomat];
      return '1,'+a;
    }
    if(this.getSolarterms(yy,mm,dd)){
      let a = this.getSolarterms(yy,mm,dd);
      return '2,'+a;
    }
    return lunarDay;
  }

  static GetBit(m, n) {
    return (m >> n) & 1;
  }

  //农历转换
  e2c(yy: number, mm: number, dd: number) {
    this.TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
    let total, m, n, k;
    let isEnd = false;
    if (yy < 1900) {
      yy += 1900;
    }
    total = (yy - 1921) * 365 + Math.floor((yy - 1921) / 4) + this.madd[this.TheDate.getMonth()] + this.TheDate.getDate() - 38;

    if (yy % 4 == 0 && mm > 1) {
      total++;
    }
    for (m = 0; ; m++) {
      k = (this.CalendarData[m] < 0xfff) ? 11 : 12;
      for (n = k; n >= 0; n--) {
        if (total <= 29 + ScheduleService.GetBit(this.CalendarData[m], n)) {
          isEnd = true;
          break;
        }
        total = total - 29 - ScheduleService.GetBit(this.CalendarData[m], n);
      }
      if (isEnd) break;
    }
    this.cYear = 1921 + m;
    this.cMonth = k - n + 1;
    this.cDay = total;
    if (k == 12) {
      if (this.cMonth == Math.floor(this.CalendarData[m] / 0x10000) + 1) {
        this.cMonth = 1 - this.cMonth;
      }
      if (this.cMonth > Math.floor(this.CalendarData[m] / 0x10000) + 1) {
        this.cMonth--;
      }
    }
  }

  GetcDateString() {
    let tmp = "";
    /*显示农历年：（ 如：甲午(马)年 ）*/
    tmp+=this.tgString.charAt((this.cYear-4)%10);
    tmp+=this.dzString.charAt((this.cYear-4)%12);
    tmp+="(";
    tmp+=this.sx.charAt((this.cYear-4)%12);
    tmp+=")年 ";
    if (this.cMonth < 1) {
      tmp += "(闰)";
      tmp += this.monString.charAt(-this.cMonth - 1);
    } else {
      tmp += this.monString.charAt(this.cMonth - 1);
    }
    tmp += "月";
    tmp += (this.cDay < 11) ? "初" : ((this.cDay < 20) ? "十" : ((this.cDay < 30) ? "廿" : "三十"));
    if (this.cDay % 10 != 0 || this.cDay == 10) {
      tmp += this.numString.charAt((this.cDay - 1) % 10);
    }
    return tmp;
  }

  GetLunarDay(solarYear, solarMonth, solarDay) {
    //solarYear = solarYear<1900?(1900+solarYear):solarYear;
    if (solarYear < 1921 || solarYear > 2100) {
      return "";
    } else {
      solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
      this.e2c(solarYear, solarMonth, solarDay);
      return this.GetcDateString();
    }
  }

  /**
   * 获取某天的节气
   * @param {number} yy
   * @param {number} mm
   * @param {number} dd
   * @returns {string}
   */
  getSolarterms(yy:number,mm:number,dd:number){
    mm = mm-1;
    let tmp1 = new Date((31556925974.7*(yy-1900)+this.sTermInfo[mm*2+1]*60000)+Date.UTC(1900,0,6,2,5));
    let tmp2 = tmp1.getUTCDate();
    let solarTerms = "";
    if (tmp2==dd){
      solarTerms = this.solarTerm[mm*2+1];
    }
    tmp1 = new Date((31556925974.7*(yy-1900)+this.sTermInfo[mm*2]*60000)+Date.UTC(1900,0,6,2,5));
    tmp2= tmp1.getUTCDate();
    if (tmp2==dd)
      solarTerms = this.solarTerm[mm*2];
    return solarTerms;
  }
}


