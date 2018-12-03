import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
/**
 * Generated class for the CoverPathPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'limitLength',
})
export class LimitLengthPipe implements PipeTransform {
  constructor(public globalData:GlobalData){

  }
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, length: number) {
    if(value.length>length&&value) {
      value = value.substring(0, length) + "...";
    }
    return value;
  }

}
