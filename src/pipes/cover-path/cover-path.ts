import { Pipe, PipeTransform } from '@angular/core';
import { PC_SERVE_URL } from '../../providers/Constants';
import {GlobalData} from "../../providers/GlobalData";
/**
 * Generated class for the CoverPathPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'coverPath',
})
export class CoverPathPipe implements PipeTransform {
  constructor(public globalData:GlobalData){

  }
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    if(value&&(
           value.indexOf('#{webServicePath}')!=-1
        || value.indexOf('#{ftpServicePath}')!=-1
        ||value.indexOf('http://localhost:8080/Learning')!=-1
        ||value.indexOf('http://127.0.0.1:8080/Learning')!=-1 )){
      value = value.replace('#{webServicePath}',PC_SERVE_URL)
                   .replace("#{ftpServicePath}",this.globalData.fileServer)
                   .replace("http://localhost:8080/Learning",PC_SERVE_URL)
                   .replace("http://127.0.0.1:8080/Learning",PC_SERVE_URL);
    }else if(value&&(value.indexOf('http://192.168.1.66')!=-1)){
      value = value.replace('http://192.168.1.66','http://192.168.0.66');
    }else if(value&&(value.indexOf('http://')!=-1 || value.indexOf('https://')!=-1)){
      return value;
    }else if (value){
      return PC_SERVE_URL+value;
    }
    return value;
  }
}
