import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Rx";
import {GlobalData} from "../../providers/GlobalData";
import {HttpService} from "../../providers/HttpService";

/*
  Generated class for the StandardsTrainServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StandardsTrainServices {

  constructor(public httpService : HttpService,
              public globalData : GlobalData) {

  }

  /**
   * 获取达标训练试卷信息
   */
  examContent(est001){
    return Observable.create(observer=>{
      this.httpService.postFormData('/standardsTrain/paper',{
        est001:est001,
        user001:this.globalData.userId,
        llog001:this.globalData.llog001
      }).subscribe(res=>{
        observer.next(res);
      },err=>{
        observer.error(err);
      });
    });
  }

  /**
   *更新达标训练状态以及进度
   */
  updateStandardsInfo(paramMap){
    return this.httpService.postFormData('/standardsTrain/updateStandardsInfo',paramMap);
  }

  /**
   * 更新进度
   *
   */
  updateProgress(paramMap){
    return this.httpService.postFormData('/standardsTrain/updateProgress',paramMap);
  }

}
