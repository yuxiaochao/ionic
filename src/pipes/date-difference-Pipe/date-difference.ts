import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {PC_SERVE_URL} from "../../providers/Constants"

@Pipe({
  name: 'dateDifferencePipe',
})
export class DateDifferencePipe implements PipeTransform {

  constructor(public globalData:GlobalData){
  }

  /**
   * @param baseValue
   * @param value
   */
  transform(baseValue:any,value:any) {
    baseValue = new Date(baseValue);
    value = new Date(value);
    debugger
    return baseValue.getDate() != value.getDate();
  }
}
