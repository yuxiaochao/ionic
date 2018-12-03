import { Pipe, PipeTransform } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the CoverPathPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'keywordMarkUp',
})
export class KeywordMarkUpPipe implements PipeTransform {
  constructor(public globalData:GlobalData,private sanitizer: DomSanitizer){

  }
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string,keyword?:string) {
    if(value && keyword){
      value = value.replace(keyword,"<span style='color: coral;'>" + keyword + "</span>");
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
