import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {ConferencesigningPage} from "../conferencesigning/conferencesigning";
import {Utils} from "../../../../providers/Utils";

/**
 * Generated class for the ConferencelistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conferencelist',
  templateUrl: 'conferencelist.html',
})
export class ConferencelistPage {

  mettingList=[];//会议信息

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService,
              private alert:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConferencelistPage');
    this.initDate();
  }
  ionViewDidEnter(){
    this.initDate();
  }

  initDate(){
    this.initInfo({METP003:1}).auditTime(500).subscribe(data=>{
      if(data){
        this.mettingList=data.mettingList;
      }
    })
  }

  initInfo(paramMap?){
    return  this.commonService.getPage('/huarui/hrswTCalendarmeeting/meetingOrTask',paramMap);
  }



  tasksign(obj){

    let time=Utils.dateFormat(new Date(),'yyyy-mm-dd hh24:mi:ss')
    if(obj.STYLE01==1){
      let time=new Date().getTime();
      let starttime=obj.MEET003;
    debugger
      let mitune=Math.floor((starttime-time)/60000);
      if(mitune<=15){
        this.navCtrl.push('ConferencesigningPage',{MEET001:obj.MEET001,TYPE:1})
      }else{
        let alert=this.alert.create({
          title:'请于会议开始前15分钟开始签到！',
          buttons:[{
            text:'确定',
            handler:()=>{

            }
          }]
        }).present()
      }

    }else if(obj.STYLE01==0 && obj.STYLE==0) {
      if(obj.SIGNNUMBER==1){
         let alert=this.alert.create({
          title:'该会议您已经签到！',
          buttons:[{
            text:'确定',
            handler:()=>{

            }
          }]
        }).present()
      }else{
        this.navCtrl.push('ConferencesigningPage',{MEET001:obj.MEET001,TYPE:1})
      }

    }else if(obj.STYLE==1){
      let alert=this.alert.create({
        title:'该会议已经结束！',
        buttons:[{
          text:'确定',
          handler:()=>{

          }
        }]
      }).present()
    }
  }
}
