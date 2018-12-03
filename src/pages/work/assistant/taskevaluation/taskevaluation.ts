import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {StartevaluationPage} from "./startevaluation/startevaluation";
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the TaskevaluationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-taskevaluation',
  templateUrl: 'taskevaluation.html',
})
export class TaskevaluationPage {

  taskList=[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService,
              public alert:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TaskevaluationPage');
    this.initDate();
  }

  initDate(){
    this.initInfo({}).subscribe(data=>{
      if(data){
        this.taskList=data.taskResultList;
        for(let i=0;i<this.taskList.length;i++){

          let userList=this.taskList[i].USERLIST;
           this.taskList[i].USERLIST=userList.split(",");
        }


      }
    })

  }

  initInfo(paramMap?){
    return this.commonService.getPage('/huarui/hrswTMeetingtasksignin/taskResultList',paramMap);
  }




  startenal(obj){
    this.navCtrl.push('StartevaluationPage',{ITEM:obj})
  }

}
