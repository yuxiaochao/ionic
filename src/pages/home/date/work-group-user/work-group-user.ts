import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the WorkGroupUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-work-group-user',
  templateUrl: 'work-group-user.html',
})
export class WorkGroupUserPage {

  workGroupUserList:any=[];
  callback:any;
  groupId:string;
  relationship:string;
  option:string;
  checkOption:any=[];
  callbackRoot:any;
  optionType:number;//0.单选 1.多选
  tabIndex: number = 2;
  thisType:number;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService) {
  }

  ionViewDidLoad() {
    let ch =this.navParams.get('checkOption');
    this.checkOption = ch?ch:[];
    this.thisType = this.navParams.get('thisType');
    this.optionType = this.navParams.get('optionType');
    this.callback = this.navParams.get("callback");
    this.groupId = this.navParams.get("groupId");
    this.option = this.navParams.get("option");
    this.tabIndex = this.navParams.get("tabIndex")
    == undefined
    || this.navParams.get('tabIndex') == null ? 2 : this.navParams.get('tabIndex');
    this.callbackRoot = this.navParams.get('callbackRoot');
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/workGroupUser',
      {groupId:this.groupId}).subscribe(data=>{
      if(data.workGroupUserList){
        this.workGroupUserList = data.workGroupUserList;
      }
    });
  }

  toSelect() {
    console.log(this.navCtrl.getViews());
    this.navCtrl.push('HyorganizationmanPage', {
      option:this.relationship,
      callback:this.callbackRoot,
      optionType:this.optionType,
      tabIndex: ++this.tabIndex
    });
    if(this.thisType>0){
      for (let i = 0; i < this.tabIndex; i++) {
        this.navCtrl.remove(2+this.thisType);
      }
    }else{
      for (let i = 0; i < this.tabIndex; i++) {
        this.navCtrl.remove(2);
      }
    }
  }

  isFinish(){
    this.workGroupUserList.forEach(item=>{
      if(item.check&&item.check==true){
        this.checkOption.push(item.USER001);
      }
    });
    console.log(this.navCtrl.getViews());
    this.navCtrl.push('HyorganizationmanPage', {
      checkOption:this.checkOption,
      callback:this.callbackRoot,
      optionType:this.optionType,
      tabIndex: ++this.tabIndex
    });
    if(this.thisType>0){
      for (let i = 0; i < this.tabIndex; i++) {
        this.navCtrl.remove(2+this.thisType);
      }
    }else{
      for (let i = 0; i < this.tabIndex; i++) {
        this.navCtrl.remove(2);
      }
    }
  }
}
