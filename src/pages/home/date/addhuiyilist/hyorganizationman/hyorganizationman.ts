import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../../service/CommonService";

/**
 * Generated class for the HyorganizationmanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hyorganizationman',
  templateUrl: 'hyorganizationman.html',
})
export class HyorganizationmanPage {

  callbackRoot:any;
  option:string;
  userInfo:any=[];
  type:boolean=false;
  optionType:number;//0.单选 1.多选
  checkOption:any=[];
  userInfoMultiple:any=[];//多个用户的信息
  optionItem:string='';
  tabIndex: number = 2;
  thisType:number;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService) {
  }

  ionViewDidLoad() {
    this.thisType = this.navParams.get('thisType');
    this.optionType = this.navParams.get('optionType');
    this.callbackRoot = this.navParams.get("callback");
    this.tabIndex = this.navParams.get("tabIndex")
    == undefined
    || this.navParams.get('tabIndex') == null ? 2 : this.navParams.get('tabIndex');
    if(this.optionType==0){
      this.option = this.navParams.get("option");
      if(this.option){
        this.commonService.getInfo({USER001:this.option}).subscribe(data=>{
          if(data.userInfo){
            this.type=true;
            this.userInfo = data.userInfo;
          }
        });
      }
    }else if(this.optionType==1) {
      this.checkOption = this.navParams.get('checkOption');
      // if(this.checkOption&&this.checkOption.length!=0){
      //   this.checkOption.forEach(item=>{
      //     this.optionItem+=item+",";
      //   });
      // }
      if (this.checkOption&&this.checkOption.length!=0) {
        this.commonService.getPage('/mine/userInfoMultiple',
          {option: this.checkOption}).subscribe(data => {
          if (data.userInfoMultiple) {
            this.type = true;
            this.userInfoMultiple = data.userInfoMultiple;
          }
        });
      }
    }
  }


  //跳转全部用户
  toAllUser(){
    this.navCtrl.push('AllUserGroupPage', {
      callback: (data)=>{
        return new Promise((resolve, reject) => {
          resolve();
        });
      },
      thisType:this.thisType,
      callbackRoot:this.callbackRoot,
      optionType:this.optionType,
      checkOption:this.checkOption
    });
  }

  //跳转工作组页面
  toWorkGroup(){
    this.navCtrl.push('WorkGroupPage', {
      callback: (data)=>{
        return new Promise((resolve, reject) => {
          resolve();
        });
      },
      thisType:this.thisType,
      callbackRoot:this.callbackRoot,
      optionType:this.optionType,
      checkOption:this.checkOption
    });
  }

  toClose(type:number,index?){
    if(type==0){//单选删除
      this.option="";
      this.type=false;
    }else if(type==1){//多选删除
      this.userInfoMultiple.remove(index);
      this.checkOption.remove(index);
    }
  }

  isFinish(){
    if(this.optionType==0){//单选
      let option:string='';
      let user005:string='';
      if(this.option){
        option=this.option;
        user005 = this.userInfo['USER005'];
      }
      this.callbackRoot(option,user005).then(()=>{
        this.navCtrl.pop();
      });
    }else if(this.optionType==1){//多选
      this.callbackRoot(this.checkOption).then(()=>{
        this.navCtrl.pop();
      });
    }
  }

}
