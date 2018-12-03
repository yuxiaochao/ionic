import { Injectable } from '@angular/core';
import {GlobalData} from "../../providers/GlobalData";
import {HttpService} from "../../providers/HttpService";
import {Observable} from "rxjs";
@Injectable()
export class OnlineQuestionnaireService {

  constructor(public httpService : HttpService,
              public globalData : GlobalData) {
  }

  /**
   * 查询调查问卷试题信息
   * @param ques001 问卷调查ID
   * @returns {any}
   */
  questionnaireContent(ques001){
    return Observable.create(observer=>{
      this.httpService.postFormData('/research/researchContent',{
        QUES001:ques001,
        USER001:this.globalData.userId,
        llog001:this.globalData.llog001
      }).subscribe(res=>{
        observer.next(res);
      },err=>{
        observer.error(err);
      });
    });
  }

  /**
   * 提交调查问卷
   * @param param
   * @returns {any}
   */
  submitQuestionnaire(param:any){
    param.USER001 = this.globalData.userId;
    return Observable.create(observer => {
      this.httpService.postFormData('/research/submitResearch',param).subscribe(res=>{
        observer.next(res);
      },
      err=>{
        observer.error(err);
      });
    });
  }

  /**
   * 查看问卷结果(客观题)
   * @param egid
   * @returns {Observable<any>}
   */
  findQuestionnaireKGResult(paramMap){
    return this.httpService.postFormData('/research/recordKg',{
      USER001:this.globalData.userId,
      QUES001:paramMap.QUES001,
      QTOP001:paramMap.QTOP001
    })
  }

  /**
   * 查看问卷结果(主观题)
   * @param egid
   * @returns {Observable<any>}
   */
  findQuestionnaireZGResult(paramMap){
    return this.httpService.postFormData('/research/recordZg',{
      USER001:this.globalData.userId,
      QUES001:paramMap.QUES001,
      URES003:paramMap.URES003
    })
  }

  //查看答卷
  viewPaper(paramMap){
    return this.httpService.postFormData('/exam/viewPaper',paramMap)
  }

}
