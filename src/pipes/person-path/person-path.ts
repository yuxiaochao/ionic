import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {PC_SERVE_URL} from "../../providers/Constants"

/**
 * Generated class for the PersonPathPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'personPath',
})
export class PersonPathPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(public globalData:GlobalData){

  }
  transform(value: string) {
    if(value){
      value = this.globalData.fileServer+"/"+value;
    }else{
      value = PC_SERVE_URL+"resources/image/user/zhaopian.jpg";
    }
    return value;
  }
}
