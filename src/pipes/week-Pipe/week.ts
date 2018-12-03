import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {PC_SERVE_URL} from "../../providers/Constants"

@Pipe({
  name: 'weekPipe',
})
export class WeekPipe implements PipeTransform {

  constructor(public globalData:GlobalData){
  }

  /**
   * @param value
   */
  transform(value:string) {
    value=value+'';
    switch (value) {
      case '0':value="周日";break;
      case '1':value="周一";break;
      case '2':value="周二";break;
      case '3':value="周三";break;
      case '4':value="周四";break;
      case '5':value="周五";break;
      case '6':value="周六";break;
      default : value="错误日期"
    }
    return value

  }
}
