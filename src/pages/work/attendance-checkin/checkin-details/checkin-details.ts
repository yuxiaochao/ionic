import {Component} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

@IonicPage()
@Component({
  selector: 'page-checkin-details',
  templateUrl: 'checkin-details.html',
})
export class CheckinDetailsPage {

  work:any=[];
  type:number;
  callback:any;
  attendancePlan:any=[];
  imageDataitem:any=[];
  thisbigImg:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,) {
  }

  ionViewDidLoad() {
    this.attendancePlan = this.navParams.get('attendancePlan');
    this.work = this.navParams.get('work');
    this.type = this.navParams.get('type');
    this.getImg();
  }

  getImg(){
    this.commonService.getPage('/huarui/hrswTAttendanceplan/getSignInPicture',
      {sipi002: this.work.MTSI001}).subscribe(data => {
        if(data.imageDataitem){
          this.imageDataitem = data.imageDataitem;
        }
    });
  }

  bigImg(item?){
    if(this.thisbigImg==item){
      this.thisbigImg='';
    }else {
      this.thisbigImg=item;
    }

  }

}
