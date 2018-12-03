import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

@IonicPage()
@Component({
  selector: 'page-lvli',
  templateUrl: 'lvli.html',
})
export class LvliPage {

  trainingResume:any=[];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,) {
  }

  ionViewDidLoad() {
    this.commonService.getPage('/huarui/xzxyTTraining/findTrainingResume').subscribe(data => {
      if(data.findTrainingResume&&data.findTrainingResume.length>0){
        this.trainingResume = data.findTrainingResume;
      }
    });
  }

}
