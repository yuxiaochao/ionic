import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {PC_SERVE_URL} from "../../providers/Constants"

@Pipe({
  name: 'optionText',
})
export class OptionTextPipe implements PipeTransform {

  constructor(public globalData:GlobalData){
  }

  /**
   * @param value
   * @param type 0.提醒 1.重复 2.任务提醒
   */
  transform(value:number,type:number) {
    if(type==0){
      if(value==0){
        return '不提醒';
      }else if(value==1){
        return '日程开始时';
      }else if(value==2){
        return '提前5分钟';
      }else if(value==3){
        return '提前30分钟';
      }else if(value==4){
        return '提前1小时';
      }else if(value==5){
        return '提前1天';
      }
    }else if(type==1){
      if(value==0){
        return '不重复';
      }else if(value==1){
        return '每天';
      }else if(value==2){
        return '每周';
      }else if(value==3){
        return '每两周';
      }else if(value==4){
        return '每月';
      }else if(value==5){
        return '每年';
      }
    }else if(type==2){
      if(value==0){
        return '不提醒';
      }else if(value==1){
        return '任务开始时';
      }else if(value==2){
        return '提前5分钟';
      }else if(value==3){
        return '提前1小时';
      }else if(value==4){
        return '提前一天';
      }else if(value==5){
        return '截止前15分钟';
      }else if(value==6){
        return '截止前1小时';
      }else if(value==7){
        return '截止前3小时';
      }else if(value==8){
        return '截止前1天';
      }
    }

  }
}
