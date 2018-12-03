import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalData} from "../../../providers/GlobalData";
import {CommonService} from "../../../service/CommonService";
import {FactconfirmPage} from "../../work/Todo/waitconfirm/factconfirm/factconfirm";
import {RecordDatilPage} from "./record-datil/record-datil";

/**
 * Generated class for the RecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-record',
  templateUrl: 'record.html',
})
export class RecordPage {

  factsResportHistory:any=[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public gloabData:GlobalData,
              public commonService:CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecordPage');
    this.initDate();
  }
  initDate(){
      this.initInfo().subscribe(data=>{
        if(data){
           this.factsResportHistory=data.factsResportHistory;
        }
      })
  }
  initInfo(paramMap?){
    return this.commonService.getPage('/huarui/hrswTDocumentaryfactsreport/factsReportHistory',paramMap)
  }

  lookDatil(obj){
    this.navCtrl.push('RecordDatilPage',{factsReport:obj,TYPE:0})
  }

}
