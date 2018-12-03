import { Injectable } from '@angular/core';
import {HttpService} from "../../providers/HttpService";
import {GlobalData} from "../../providers/GlobalData";
import {CommonService} from "../CommonService";
import {Observable} from "rxjs/Rx";

@Injectable()
export class ExamExercisesService {

  constructor(public httpService : HttpService,
              public globalData : GlobalData,
              public commonService:CommonService) {
  }

  //获取题库练习列表
  getExamExercisesList(paramMap?){
    return this.commonService.getPage('/exercises/list',paramMap);
  }

  //获取题库练习试题列表
  getExerciseDetail(paramMap){
    paramMap.user001 = this.globalData.userId;
    return this.httpService.postFormData('/exercises/exerciseList',paramMap);
  }

  //获取二级题库
  getSecondaryExercise(paramMap){
    paramMap.user001 = this.globalData.userId;
    return this.httpService.postFormData('/exercises/secondaryExerciseList',paramMap);
  }

  //进入答题
  intoExerciseAnswer(paramMap){
    paramMap.user001 = this.globalData.userId;
    paramMap.llog001 = this.globalData.llog001;
    return this.httpService.postFormData('/exercises/paper',paramMap);
  }

  //进入答题(继续上次练习)
  intoExerciseAnswerContinue(paramMap){
    paramMap.user001 = this.globalData.userId;
    return this.httpService.postFormData('/exercises/paperContinue',paramMap);
  }

 //提交评论
  submitComment(paramMap){
    paramMap.user001 = this.globalData.userId;
    return this.httpService.postFormData('/exercises/submitComment',paramMap);
  }

  //删除试题评论
  delComment(emes001){
    return this.httpService.postFormData('/exercises/delComment',{emes001:emes001});
  }

  submitExer(param:any){
    param.user001 = this.globalData.userId;
    return Observable.create(observer => {
      this.httpService.postFormData('/exercises/submit',param).subscribe(res=>{
          observer.next(res);
        },
        err=>{
          observer.error(err);
        });
    });
  }
}
