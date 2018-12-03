import {Injectable} from '@angular/core';

declare let hex_md5;

/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class Utils {

  constructor() {
  }

  static isEmpty(value): boolean {
    return value == null || typeof value === 'string' && value.length === 0;
  }

  static isNotEmpty(value): boolean {
    return !Utils.isEmpty(value);
  }

  /**
   * 格式“是”or“否”
   * @param value
   * @returns {string|string}
   */
  static formatYesOrNo(value: number | string): string {
    return value == 1 ? '是' : (value == '0' ? '否' : null);
  }


  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                               "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }

  /**
   * 每次调用sequence加1
   * @type {()=>number}
   */
  static getSequence = (function () {
    let sequence = 1;
    return function () {
      return ++sequence;
    };
  })();

  /**
   * 返回字符串长度，中文计数为2
   * @param str
   * @returns {number}
   */
  static strLength(str: string): number {
    let len = 0;
    for (let i = 0, length = str.length; i < length; i++) {
      str.charCodeAt(i) > 255 ? len += 2 : len++;
    }
    return len;
  }

  /**
   * 把url中的双斜杠替换为单斜杠
   * 如:http://localhost:8080//api//demo.替换后http://localhost:8080/api/demo
   * @param url
   * @returns {string}
   */
  static formatUrl(url: string = ''): string {
    let index = 0;
    if (url.startsWith('http')) {
      index = 7
    }
    return url.substring(0, index) + url.substring(index).replace(/\/\/*/g, '/');
  }


  static sessionStorageGetItem(key: string) {
    let jsonString = sessionStorage.getItem(key);
    if (jsonString) {
      return JSON.parse(jsonString);
    }
    return null;
  }

  static sessionStorageSetItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static sessionStorageRemoveItem(key: string) {
    sessionStorage.removeItem(key);
  }

  static sessionStorageClear() {
    sessionStorage.clear();
  }

  /**
   * 字符串加密
   * @param str
   * @returns {any}
   */
  static hex_md5(str: string) {
    return hex_md5(str);
  }

  /** 产生一个随机的32位长度字符串 */
  static uuid() {
    let text = "";
    let possible = "abcdef0123456789";
    for (let i = 0; i < 19; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text + new Date().getTime();
  }

  //根据数字获取对应的字母
  static letter(num:number){
    let t = num % 26;
    if(!t){
      t = 26;
    }
    return String.fromCodePoint(t + 64);
  }

  static getNumber(str:string) {
    return str.charCodeAt(0) - 64;
  }

  static formatSeconds(formatObj) { //{value:value,showMinute:showMinute,showHours:showHours,fromatsp:fromatsp}
    //注：value：秒数，showMinute：是否以秒分显示，showHours：是否以秒分时显示，fromatsp：true->：分割 false:以时分秒分割
    let theTime = parseInt(formatObj.value);// 秒
    let theTime1 = 0;// 分
    let theTime2 = 0;// 小时
    if(theTime > 60 && formatObj.showMinute) {
      theTime1 = parseInt(theTime/60+'');
      theTime =  parseInt(theTime%60+'');
      if(theTime1 > 60 && formatObj.showHours && formatObj.showMinute) {
        theTime2 = parseInt(theTime1/60+'');
        theTime1 = parseInt(theTime1%60+'');
      }
    }
    var result;
    if(theTime < 10 && (theTime >= 0 || theTime1 > 0)){
      result = "0"+theTime+(formatObj.formatsp?"":"秒");
    }else{
      result = ""+theTime+(formatObj.formatsp?"":"秒");
    }

    if(theTime1 < 10){
      result = "0"+theTime1+(formatObj.formatsp?":":"分")+result;
    }else{
      result = ""+theTime1+(formatObj.formatsp?":":"分")+result;
    }

    if(theTime2 > 0 ) {
      if(theTime2 < 10){
        result = "0"+theTime2+(formatObj.formatsp?":":"小时")+result;
      }else{
        result = ""+theTime2+(formatObj.formatsp?":":"小时")+result;
      }

    }
    return result;
  }

  /**
   * 获取两个经纬度之间的距离
   * @param lat1 第一点的纬度
   * @param lng1 第一点的经度
   * @param lat2 第二点的纬度
   * @param lng2 第二点的经度
   * @returns {Number}
   */
  static getDistance(lat1,lng1,lat2,lng2){

    lat1 = parseFloat(lat1);
    lng1 = parseFloat(lng1);
    lat2 = parseFloat(lat2);
    lng2 = parseFloat(lng2);
    function getRad(d){
      let PI = Math.PI;
      return d*PI/180.0;
    }

    let f = getRad((lat1 + lat2)/2);
    let g = getRad((lat1 - lat2)/2);
    let l = getRad((lng1 - lng2)/2);
    let sg = Math.sin(g);
    let sl = Math.sin(l);
    let sf = Math.sin(f);
    let s,c,w,r,d,h1,h2;
    let a = 6378137.0;//The Radius of eath in meter.
    let fl = 1/298.257;
    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;
    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;
    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;
    s = d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
    //s = s/1000;
    s = s.toFixed(2);//指定小数点后的位数。
    return s;
  }

  /**
   * @param arr 参数数组
   */
  static arrayDeduplication(arr:Array<any>){
    let object:any = {};
    arr.forEach(data=>{
      object[data]=1;
    });
    arr=[];
    for(let key in object) {
      arr.push(key);
    }
    return arr;
  }

}
