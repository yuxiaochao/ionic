import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";

@Pipe({
  name: 'testPipe',
})
export class TestPipe implements PipeTransform {
  constructor(public globalData:GlobalData){
  }

  /**
   * 测试管道用于测试页面数据
   * @param value
   * @param param
   */
  transform(value: string, param:string) {
    let va = value;
    return value;
  }

}
