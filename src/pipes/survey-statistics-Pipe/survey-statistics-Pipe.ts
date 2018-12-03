import {Pipe, PipeTransform} from '@angular/core';
import {PC_SERVE_URL} from '../../providers/Constants';
import {GlobalData} from "../../providers/GlobalData";

/**
 * Generated class for the CoverPathPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'surveyStatistics',
})
export class SurveyStatisticsPipe implements PipeTransform {
  constructor(public globalData: GlobalData) {

  }

  /**
   * valueArry[0]  选项
   * valueArry[1]  人数
   * valueArry[2]  进度%
   * valueArry[3]  选项内容
   * @param {string} value
   * @param type
   * @returns {string}
   */
  transform(value: string,type) {

    if (value&&type==0) {//全部文字显示
      let valueArry = value.split(",");
      if (value.indexOf('allNum') != -1) {
        return value = "投票总数：" + valueArry[1];
      } else if (value.indexOf('giveUp') != -1) {
        return value = "弃权数：" + valueArry[1] + "  占" + valueArry[2];
      } else if (value.indexOf('QTOP011') != -1) {
        return value = valueArry[1];
      } else {
        return value = "选择--" + valueArry[0] + "--的人数为"
          + valueArry[1] + "  占" + valueArry[2] + valueArry[3];
      }
    } else if (value&&type==1) {//进度条显示
      let valueArry = value.split(",");
      if(value.indexOf('allNum') == -1&&value.indexOf('QTOP011') == -1) {
        return value = valueArry[2];
      }
    }else if (value&&type==2) {//选项显示
      let valueArry = value.split(",");
      if(value.indexOf('allNum') == -1&&value.indexOf('QTOP011') == -1&&value.indexOf('giveUp') == -1) {
        return value = valueArry[0];
      }else if(value.indexOf('giveUp') != -1){
        return value = "弃权";
      }
    }else if (value&&type==3) {//人数显示 选项内容显示
      let valueArry = value.split(",");
      if (value.indexOf('allNum') == -1 && value.indexOf('QTOP011') == -1&&value.indexOf('giveUp') == -1) {
        return value = "共有"+valueArry[1]+"人选择 "+valueArry[3];
      }else if(value.indexOf('giveUp') != -1){
        return value = "共有"+valueArry[1]+"人选择 弃权";
      }else if(value.indexOf('QTOP011') != -1){
        return value = valueArry[1];
      }else if(value.indexOf('allNum') != -1){
        return value = "总共调查人数："+valueArry[1];
      }
    }
  }
}
