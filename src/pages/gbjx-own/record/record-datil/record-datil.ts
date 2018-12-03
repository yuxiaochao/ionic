import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the RecordDatilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-record-datil',
  templateUrl: 'record-datil.html',
})
export class RecordDatilPage {

  factsReport={};
  dutyList=[];
  achievementList=[];
  problemList=[];
  type:number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService,
              private alert:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordDatilPage');
    this.factsReport=this.navParams.get("factsReport");
    this.type=this.navParams.get("TYPE");
    this.initData();
  }


  initData(){
    this.initInfo({
      DOFR002:this.factsReport["DOFR002"],
      DOFR003:this.factsReport["DOFR003"],
      DOFR007:this.type,
      DOFR005:'1,2,3'}).auditTime(500).subscribe(data=>{
      if(data){
        this.dutyList=data.dutyList;
        this.achievementList=data.achievementList;
        this.problemList=data.problemList;
      }
    })
  }

  initInfo(paramMap?){
    return this.commonService.getPage('/huarui/hrswTDocumentaryfactsreport/selectFactsReportdetails',paramMap);

  }

}
