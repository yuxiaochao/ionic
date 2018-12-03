import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalData} from "../../../../providers/GlobalData";

/**
 * Generated class for the TrainingCourseListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-training-course-list',
  templateUrl: 'training-course-list.html',
})
export class TrainingCourseListPage {

  trainCourseId:string;
  trainCourseList:any=[];
  callback:any;
  trainCourse:any;
  constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public globdate:GlobalData) {
  }

  ionViewDidLoad() {
    this.trainCourseId=this.navParams.get("trainCourseId");
    this.trainCourseList=this.globdate.myTrainingClass;
    // this.callback = this.navParams.get("callback");
  }

  toSelect(obj){
    let  trainCourseList = this.globdate.myTrainingClass;
    for(let i=0;i<trainCourseList.length;i++){
      if(obj==trainCourseList[i]["TRUS016"]){
        this.globdate.currentTrainingClass=this.globdate.myTrainingClass[i]
        this.navCtrl.pop();
      }
    }
    // this.callback(this.trainCourse,obj).then(()=>{
    //
    // });
  }
}
