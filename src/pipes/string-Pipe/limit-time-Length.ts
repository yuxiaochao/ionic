import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
/**
 * Generated class for the CoverPathPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'limitTimeLength',
})
export class LimitTimeLengthPipe implements PipeTransform {
  constructor(public globalData:GlobalData){

  }
  /**
   * type
   * 0.调查记录学习记录去掉重复‘div00_point’
   * 1.调查记录学习记录去掉重复日期
   * 2.单选按钮是否需要选中
   * 3.显示选项ITEMS
   * 4.调查列表当可参与次数为‘0’时显示‘不限次’
   * Takes a value and makes it lowercase.
   */
  transform(value: string, pvevalue: string,type:number) {
    let letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(value&&pvevalue&&type==1&&value==pvevalue) {
      return '';
    }else if(value&&pvevalue&&type==0&&value!=pvevalue){
      return 'div00_point';
    }else if(value&&pvevalue&&type==2){
      let num = letter.indexOf(pvevalue);
      return num+""==value;
    }else if(value&&type==3){
      let Option = value.split('$$');
      return Option;
    }else if(value&&type==4&&value=='0'){
      return '不限次';
    }
    return value;
  }

}
