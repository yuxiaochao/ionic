import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {WkmtdetailPage} from "./wkmtdetail/wkmtdetail";
import {CommonService} from "../../../../service/CommonService";
import {DetailsofthemeetingPage} from "../detailsofthemeeting/detailsofthemeeting";

/**
 * Generated class for the WeekmeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-weekmeeting',
  templateUrl: 'weekmeeting.html',
})
export class WeekmeetingPage {

  mettingList=[];//会议列表
  noReaderMeet:any=[]
  week:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeekmeetingPage');
    this.initDate();
  }

  initDate(){
    this.initInfo({METP003:1}).auditTime(500).subscribe(data=>{
      if(data){
      this.mettingList=data.mettingList;

      for(let i=0;i<this.mettingList.length;i++){
        if(this.mettingList[i]["ISREADER"]==1){
          this.noReaderMeet.push(this.mettingList[i]);
        }
      }
           this.addMessageReader(this.noReaderMeet);
      }
    })
  }
addMessageReader(obj){

    for(let i=0;i<obj.length;i++){
      this.commonService.getPage('/huarui/HrswTmessageReader/insertMessageReader',{
        MREA002:obj[i].MEET001,
        MREA004:'安卓'
      }).subscribe(data=>{

        if(data.flage){

        }
      })
    }


}
  initInfo(paramMap?){
    return  this.commonService.getPage('/huarui/hrswTCalendarmeeting/meetingOrTask',paramMap);
  }
  wkmtdetail(obj){
    this.navCtrl.push('DetailsofthemeetingPage',{MEETING:obj});
  }
}
