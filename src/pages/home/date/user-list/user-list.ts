import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the WorkGroupUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {

  meetingUserInfo: any = [];
  checkOption: any = [];
  userInfoMultiple: any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService) {
  }

  ionViewDidLoad() {
    this.meetingUserInfo = this.navParams.get('meetingUserInfo');
    this.meetingUserInfo.forEach(item => {
      if (item.metp005) {
        this.checkOption.push(item.metp005);
      } else if (item.METP005) {
        this.checkOption.push(item.METP005);
      } else if (item.mtsi004) {
        this.checkOption.push(item.mtsi004);
      } else if (item.MTSI004) {
        this.checkOption.push(item.MTSI004);
      }
    });
    if (this.meetingUserInfo.length!=0) {
      this.commonService.getPage('/mine/userInfoMultiple',
        {option: this.checkOption}).subscribe(data => {
        if (data.userInfoMultiple) {
          this.userInfoMultiple = data.userInfoMultiple;
        }
      });
    }

  }

  //点击联系人
  clickContacts(obj) {
    this.navCtrl.push('DetailsFriendsPage', {USER001: obj.USER001});
  }

}
