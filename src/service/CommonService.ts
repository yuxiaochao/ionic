import { Injectable } from "@angular/core";
import {HttpService} from "../providers/HttpService";
import { NativeService } from "../providers/NativeService"
import {GlobalData} from "../providers/GlobalData";

@Injectable()
export class CommonService{
  constructor(private httpService : HttpService,
              private nativeService : NativeService,
              private globalData : GlobalData){}
  /**
   * 获取新token
   */
  getNewToken() {
    return this.httpService.post('/user/refresh_token');
  }

  /**
   * 查询用户信息
   */
  getUserInfo() {
    return this.httpService.get('/mine/selfInfo');
  }

  /**
   * 获取用户信息
   *
   */
  getInfo(paramMap?){
    return this.httpService.get('/mine/userInfo',paramMap);
  }

  /**
   * 登录获取token
   */
  getToken(username,password){
    return this.httpService.post('/user/login',{
      'user004': username,
      'user016' : password,
      'user026' : this.nativeService.getMobile()
    })
  }

  /**
   * 分页列表
   */
  getPage(url : string,paramMap?:any){
    if(!paramMap){
      paramMap = {
        KEYWORD : '',
        START : 1,
        LIMIT : 10
      }
    }
    if(!paramMap.START){
      paramMap.START = 1;
    }
    if(!paramMap.LIMIT){
      paramMap.LIMIT = 10;
    }
    paramMap.USER001 = this.globalData.userId;
    //已选中的培训班ID
    let classid = this.globalData.currentTrainingClass;
    if(classid){
      paramMap.TRAININGID = classid['TRUS016'];
    }
    return this.httpService.postFormData(url,paramMap)
  }

}
