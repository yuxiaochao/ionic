import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../../../service/CommonService";

/**
 * Generated class for the LabelrenwPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-labelrenw',
  templateUrl: 'labelrenw.html',
})
export class LabelrenwPage {

  taskLabelList:any=[];//标签列表
  taskLabelId:string;
  callback:any;
  relationship:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService) {
  }

  ionViewDidLoad() {
    this.callback = this.navParams.get("callback");
    this.taskLabelId = this.navParams.get('taskLabelId');
    this.initTaskLabel();
  }

  //任务标签列表
  initTaskLabel(){
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/taskLabelList',
      {cata005:'renwuleixing'}).subscribe(data => {
      if (data.taskLabelList) {
        this.taskLabelList = data.taskLabelList;
      }
    });
  }

  toSelect(tali002) {
    this.callback(this.relationship,tali002).then(()=>{
      this.navCtrl.pop();
    });
  }

}
