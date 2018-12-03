import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {NativeService} from "../../../../providers/NativeService";

@IonicPage()
@Component({
  selector: 'page-todayjobplan',
  templateUrl: 'todayjobplan.html',
})
export class TodayjobplanPage {

  came001: string;
  item: any = [];
  week: any;
  came003: Date;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public nativeService: NativeService,) {
  }

  ionViewDidLoad() {
    this.came001 = this.navParams.get('CAME001');
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/selectSchedule',
      {CAME001: this.came001}).subscribe(data => {
      if (data.Calendarmemorandum) {
        this.item = data.Calendarmemorandum;
        this.came003 = new Date(parseInt(data.Calendarmemorandum['came003']));
        this.week = this.came003.getDay();
      }
    });
  }

  deleteRiCheng() {
    this.commonService.getPage('/huarui/hrswTCalendarmemorandum/deleteRiCheng',
      {CAME001: this.came001}).subscribe(data => {
      if (data.flag) {
        this.nativeService.alert("删除成功");
        this.navCtrl.pop();
      }
    });
  }

  toChange(){
    this.deleteRiCheng();
  }

}
