import {Pipe, PipeTransform} from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";

/**
 * Generated class for the CoverPathPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'coverHeadImpPath',
})
export class CoverHeadImpPathPipe implements PipeTransform {
  constructor(public globalData: GlobalData) {

  }

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, type?: string, obj?: any) {
    if (value) {
      if (value == "system") {
        value = "./assets/imgs/common/laba.png";
      } else if (value == "newFriend") {
        value = "./assets/imgs/common/xindehaoyou.png";
      } else if (value == "dangjianban") {
        value = "./assets/imgs/common/dangjianban.png";
      } else if (value == "group") {
        value = "./assets/imgs/common/dangjianban.png";
      }
      else {
        value = this.globalData.fileServer + "/" + value;
      }
    } else {
      if (type && type == "男") {
        value = "./assets/imgs/common/default_head_img02.jpg";
      } else if (type && type == "女") {
        value = "./assets/imgs/common/default_head_img03.jpg";
      }else {
        value = "./assets/imgs/common/default_head_img02.jpg";
      }
    }
    if (obj) {
      obj.onerror = () => {
        if (type && type == "男") {
          obj.src = "./assets/imgs/common/default_head_img02.jpg";
        } else if (type && type == "女") {
          obj.src = "./assets/imgs/common/default_head_img03.jpg";
        }
      };
    }
    return value;
  }


}
