import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Generated class for the TrustHtmlPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'trustHtml',
})
export class TrustHtmlPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(private sanitizer: DomSanitizer){

  }
  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
