import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NumberTransitionPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'numberTransition',
})
export class NumberTransitionPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number) {
    var t = value % 26;
    if(!t){
      t = 26;
    }
    return String.fromCodePoint(t + 64);
  }
}
