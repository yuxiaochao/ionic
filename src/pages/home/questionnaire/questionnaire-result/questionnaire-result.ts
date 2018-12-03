import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OnlineQuestionnaireService} from "../../../../service/online-questionnaire/OnlineQuestionnaireService";

@IonicPage()
@Component({
  selector: 'page-questionnaire-result',
  templateUrl: 'questionnaire-result.html',
})
export class QuestionnaireResultPage {

  result:any = [];
  topic:any=[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public onlineQuestionnaireService:OnlineQuestionnaireService) {
  }

  ionViewDidLoad() {
    let ques001 = this.navParams.get("QUES001");
    this.topic = this.navParams.get("TOPIC");
    for (let i =0 ;i<this.topic.length;i++){
      let qtid = this.topic[i].QTID;
      this.onlineQuestionnaireService.findQuestionnaireKGResult({QUES001:ques001,QTOP001:qtid}).subscribe(data=>{
        this.result[i]=data.choiceList;
      })
    }
  }

  again(){
    this.navCtrl.pop();
  }
}
