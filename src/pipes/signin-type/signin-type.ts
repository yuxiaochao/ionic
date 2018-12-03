import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SplitPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'signinTypePipe',
})
export class SigninTypePipe implements PipeTransform {

  transform(value:number|string) {
    if(value == 0){
      value='正常'
    }else if(value == 1){
      value='早到'
    }else if(value == 2){
      value='迟到'
    }else if(value == 3){
      value='早退'
    }else if(value == 4){
      value='加班'
    }else{
      value='异常'
    }
    return value;
  }
}
