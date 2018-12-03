import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ReplacePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'replace',
})
export class ReplacePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    return value.replace(new RegExp(args[0], "g"),args[1]);
  }
}
