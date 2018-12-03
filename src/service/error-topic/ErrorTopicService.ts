import { Injectable } from '@angular/core';
import {HttpService} from "../../providers/HttpService";
import {GlobalData} from "../../providers/GlobalData";
import {CommonService} from "../CommonService";
import {Observable} from "rxjs/Rx";

@Injectable()
export class ErrorTopicService {

  constructor(public httpService : HttpService,
              public globalData : GlobalData,
              public commonService:CommonService) {
  }

  //获取错题列表
  getErrorTopicList(paramMap?){
    return this.commonService.getPage('/errorTopic/errorTopicList',paramMap);
  }

  //验证是否有未完成的随机错题
  checkRandomErrorTopic(paramMap){
    paramMap.user001 = this.globalData.userId;
    return this.commonService.getPage('/errorTopic/checkRandomErrorTopic',paramMap);
  }
  //获取错题数据
  getErrorTopicContent(paramMap){
    paramMap.user001 = this.globalData.userId;
    return this.httpService.postFormData('/errorTopic/topicContent',paramMap);
  }

  submitErrorTopic(paramMap){
    paramMap.user001 = this.globalData.userId;
    return Observable.create(observer => {
      this.httpService.postFormData('/errorTopic/submit',paramMap).subscribe(res=>{
          observer.next(res);
        },
        err=>{
          observer.error(err);
        });
    });
  }

  //错题删除
  delErrorTopic(paramMap){
    return this.httpService.postFormData('/errorTopic/deleteErrorTopic',paramMap);
  }
}
