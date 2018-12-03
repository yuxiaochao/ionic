import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the WorkGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-work-group',
  templateUrl: 'work-group.html',
})
export class WorkGroupPage {

  workGroupList:any=[];
  callback:any;
  selectUserId:string;
  callbackRoot:any;
  optionType:number;
  thisType:number;
  checkOption:any=[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService) {
  }

  ionViewDidLoad() {
    let ch =this.navParams.get('checkOption');
    this.checkOption = ch?ch:[];
    this.thisType = this.navParams.get('thisType');
    this.callback = this.navParams.get("callback");
    this.callbackRoot = this.navParams.get('callbackRoot');
    this.optionType = this.navParams.get('optionType');
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/workGroup').subscribe(data=>{
      if(data.workGroupList){
        this.workGroupList = data.workGroupList;
      }
    });
  }

  toWorkGroupUser(param){
    this.navCtrl.push('WorkGroupUserPage', {
      callback: (data)=>{
        return new Promise((resolve, reject) => {
          this.selectUserId = data;
          resolve();
        });
      },
      groupId:param.GROU001,
      option:this.selectUserId,
      callbackRoot:this.callbackRoot,
      optionType:this.optionType,
      thisType:this.thisType,
      checkOption:this.checkOption
    });
  }

}
