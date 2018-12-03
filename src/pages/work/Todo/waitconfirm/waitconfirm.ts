import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FactconfirmPage} from "./factconfirm/factconfirm";
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the WaitconfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waitconfirm',
  templateUrl: 'waitconfirm.html',
})
export class WaitconfirmPage {
  pet = 'puppies'
  factsReportList=[]
  noReaderFactsReport=[];
  noReader=[]
  nofactsReportList=[];//数据列表
  identity=0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService) {

    this.identity= this.navParams.data
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitconfirmPage');
    if(this.identity==1){
      this.initDate();
    }

  }
  ionViewDidEnter() {
   if(this.identity==1){
      this.initDate();
    }
  }

    initDate(){

     this.initInfo({DOFR007:0}).auditTime(500).subscribe(data=>{
         if(data){
            this.nofactsReportList=data.factsReportList;

            for(let i=0;i<this.nofactsReportList.length;i++){
              if(this.nofactsReportList[i]["ISREADER"]==0){
                this.noReaderFactsReport.push(this.nofactsReportList[i]);
              }
            }
             this.addMessageReader(this.noReaderFactsReport);
         }
    })

      this.initInfo({DOFR007:1}).auditTime(500).subscribe(data=>{
          if(data){
            this.factsReportList=data.factsReportList;
            for(let i=0;i<this.factsReportList.length;i++){
              if(this.factsReportList[i]["ISREADER"]==0){
                this.noReader.push(this.factsReportList[i]);
              }
            }
            this.addMessageReader(this.noReader);

           }
      })

  }

  initInfo(paramMap){
    return this.commonService.getPage('/huarui/hrswTDocumentaryfactsreport/selectFactsReport',paramMap);
  }

  addMessageReader(obj){
    for(let i=0;i<obj.length;i++){

      this.commonService.getPage('/huarui/HrswTmessageReader/insertMessageReader',{
        MREA002:obj[i].DOFR001,
        MREA004:'安卓'
      }).subscribe(data=>{

        if(data.flage){

        }

      })

    }

  }
  factconfirm(obj,type){
    this.navCtrl.push('FactconfirmPage',{factsReport:obj,TYPE:type})
  }
}
