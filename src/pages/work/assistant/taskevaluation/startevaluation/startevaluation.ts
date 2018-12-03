import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../../service/CommonService";
import {GlobalData} from "../../../../../providers/GlobalData";

/**
 * Generated class for the StartevaluationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-startevaluation',
  templateUrl: 'startevaluation.html',
})
export class StartevaluationPage {

  items=[];
  totalNumber:number;
  signNumber:number;
  ITEM={};
  peopleList=[];
  assistant=[];
  leadership=[];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService,
              public globalData:GlobalData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartevaluationPage');
     this.ITEM=this.navParams.get("ITEM");
     this.initDate();
  }

  initDate(){

    this.initInfo({MEET001:this.ITEM["CALT001"],METP003:2}).subscribe(data=>{
      if(data){
        this.totalNumber=data.totalNumber;
        this.peopleList=data.peopleList;
        this.signNumber=data.signNumber
        for(let i=0;i<this.peopleList.length;i++){
          if(this.peopleList[i]["TYPEOFPERSONNEL"]==4){
            this.assistant.push(this.peopleList[i]["USERNAME"]);
          }else if(this.peopleList[i]["TYPEOFPERSONNEL"]==5){
            this.leadership.push(this.peopleList[i]["USERNAME"]);
          }

        }
      }
    })

    this.commonService.getPage('/research/queryResearchList',{
      START: 1,
      USER001: this.globalData.userId
    }).auditTime(500).subscribe(data=>{
      if (data.researchListPage && data.researchListPage.length >= 1) {

        this.items = data.researchListPage;
      }
    })
  }

  initInfo(paramMap?){
    return this.commonService.getPage('/huarui/hrswTCalendarmeeting/totalNumber',paramMap);
  }

  startEvaluation(){
    this.navCtrl.push('QuestionnaireTestPage', {
      QUES001: this.items[0]["QUES001"],
      QUES009: this.items[0]["QUES009"]
    });

  }
}
