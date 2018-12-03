import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {PC_SERVE_URL} from "../../providers/Constants"

@Pipe({
  name: 'userStatusPipe',
})
export class UserStatusPipe implements PipeTransform {

  constructor(public globalData:GlobalData){
  }

  /**
   * @param value 用户状态
   * @param color 是否是颜色状态
   * @param defaultName
   */
  transform(value:number,color?:boolean,defaultName?:string) {
    let status:string;
    if(color==true){
      switch (value) {
        case 1:status="dodgerblue";break;
        case 2:status="orangered";break;
        case 3:status="brown";break;
        case 4:status="burlywood";break;
        case 5:status="cadetblue";break;
        default : status="dodgerblue"
      }
    }else if(color==false){
      switch (value) {
        case 1:status="工作中";break;
        case 2:status="会议中";break;
        case 3:status="下班中";break;
        case 4:status="休假中";break;
        case 5:status="出差中";break;
        default : status=defaultName
      }
    }else {
      switch (value) {
        case 1:status="briefcase";break;
        case 2:status="people";break;
        case 3:status="bus";break;
        case 4:status="cafe";break;
        case 5:status="jet";break;
        default : status="cloud-outline"
      }
    }
    return status;

  }
}
