import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalData} from "../../../../../providers/GlobalData";
import {CommonService} from "../../../../../service/CommonService";

/**
 * Generated class for the TaskListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html',
})
export class TaskListPage {

  weektaskList=[];//本周任务列表；
  notReadList:any=[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService,
              public globDate:GlobalData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeektaskPage');
    this.initDate();
  }


  initDate(){
    this.initInfo({METP003:2}).subscribe(data=>{
      if(data){
        this.weektaskList=data.taskList;
        for(let i=0;i<this.weektaskList.length;i++){
          if(this.weektaskList[i]["ISREAD"]==0){
            this.notReadList.push(this.weektaskList[i]);
          }
        }

        this.addMessgeReader(this.notReadList);
      }
    })

  }

  initInfo(paramMap?){
    return this.commonService.getPage('/huarui/hrswTCalendarmeeting/taskList',paramMap);
  }

  addMessgeReader(obj){

    for(let i=0;i<obj.length;i++){

      this.commonService.getPage('/huarui/HrswTmessageReader/insertMessageReader',{
        MREA002:obj[i].CALT001,
        MREA004:'安卓'
      }).subscribe(data=>{

        if(data.flage){

        }

      })

    }

  }

  taskdetail(obj){
    this.navCtrl.push('DetailsofthetaskPage',{ITEM:obj});
  }
  tasksign(obj){
    this.navCtrl.push('TasksignPage',{MEET001:obj})
  }

}
