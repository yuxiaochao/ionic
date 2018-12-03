import { Injectable } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {HttpService} from "../../providers/HttpService";
import {Observable} from "rxjs";
@Injectable()
export class OnlineExamService {

  constructor(public httpService : HttpService,
              public globalData : GlobalData) {
  }

  examDetail(tact001){
   return this.httpService.postFormData('/exam/queryExamInfo',{
      TACT001:tact001,
      USER001:this.globalData.userId
    })
  }

  examContent(tact001){
    return Observable.create(observer=>{
      this.httpService.postFormData('/exam/onlineExamContent',{
        TACT001:tact001,
        USER001:this.globalData.userId,
        llog001:this.globalData.llog001
      }).subscribe(res=>{
        observer.next(res);
      },err=>{
        observer.error(err);
      });
    });
  }

  submitExam(param:any){
    param.USER001 = this.globalData.userId;
    return Observable.create(observer => {
      this.httpService.postFormData('/exam/submitExamResult',param).subscribe(res=>{
        observer.next(res);
      },
      err=>{
        observer.error(err);
      });
    });
  }

  findExamResult(egid){
    return this.httpService.postFormData('/exam/queryExamResult',{
      EGRA001 :egid
    })
  }

  //查看答卷
  viewPaper(paramMap){
    return this.httpService.postFormData('/exam/viewPaper',paramMap)
  }

}
