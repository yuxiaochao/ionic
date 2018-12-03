import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {animationFrame} from "rxjs/scheduler/animationFrame";
import {ConferencesigningPage} from "../conferencesigning/conferencesigning";

/**
 * Generated class for the TasklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tasklist',
  templateUrl: 'tasklist.html',
})
export class TasklistPage {

  taskList=[];//本周任务列表
  constructor(public navCtrl: NavController,
               public navParams: NavParams,
              public commonService:CommonService,
              public alert:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TasklistPage');
    this.initDate();
  }
  ionViewDidEnter(){
    this.initDate();
  }


  initDate(){
    this.initInfo({METP003:2}).subscribe(data=>{
      if(data){
        this.taskList=data.taskList;
      }
    })

  }

  initInfo(paramMap?){
    return this.commonService.getPage('/huarui/hrswTCalendarmeeting/meetingOrTask',paramMap);
  }
  tasksign(obj){

    if(obj.STYLE=="0"){
      let alert=this.alert.create({
        title:'本任务签到还未开始，请你稍后再试！',
        buttons:[{
          text:'确定',
          handler:()=>{
          }
        }
        ]
      }).present()
    }else if(obj.STYLE=="1" && obj.STYLE01=="1"){
      if(obj.SIGNNUMBER==obj.CALT007){
        let alert=this.alert.create({
          title:'本任务签到已完成！',
          buttons:[{
            text:'确定',
            handler:()=>{
            }
          }
          ]
        }).present()
      }else if(obj.SIGNNUMBER<obj.CALT007){
        this.navCtrl.push('ConferencesigningPage',{MEET001:obj.CALT001,TYPE:2})
      }
    }else if(obj.STYLE01==0){
      let alert=this.alert.create({
        title:'本任务签到已结束！',
        buttons:[{
          text:'确定',
          handler:()=>{

          }
        }
        ]
      }).present()

    }




  }
}
