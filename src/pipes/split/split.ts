import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SplitPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'splitPipe',
})
export class SplitPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, split:string ='$$') {
    return value.split(split);
  }
}
