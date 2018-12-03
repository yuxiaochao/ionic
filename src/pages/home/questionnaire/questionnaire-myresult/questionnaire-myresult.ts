import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

@IonicPage()
@Component({
  selector: 'page-questionnaire-myresult',
  templateUrl: 'questionnaire-myresult.html',
})
export class QuestionnaireMyresultPage {

  resultItems:any=[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,) {
  }

  ionViewDidLoad() {
    let ques001 = this.navParams.get("QUES001");
    let time = this.navParams.get("TIME");
    //let topic = this.navParams.get("TOPIC");
    let paramMap={
      QUES001:ques001,
      TIME:time
    }
    this.initQuestionnaireKGResult(paramMap).subscribe(data=>{
      this.resultItems=data.myResearchResult;
    });

  }

  initQuestionnaireKGResult(paramMap) {
    return this.commonService.getPage('/research/recordMyKg', paramMap);
  }

}
