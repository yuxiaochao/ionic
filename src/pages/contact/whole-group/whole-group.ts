import {Component, ViewChild} from '@angular/core';
import {InfiniteScroll, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalData} from "../../../providers/GlobalData";
import {CommonService} from "../../../service/CommonService";

/**
 * Generated class for the WholeGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-whole-group',
  templateUrl: 'whole-group.html',
})
export class WholeGroupPage {

  items:any = [];
  organid:string = '';//机构id
  start : number = 1;
  _flag:string = "1";//  1 查询所有机构与人员    2 查询所在部门与人员

  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globalData : GlobalData,
              public commonService : CommonService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WholeGroupPage');
    let flag = this.navParams.get("FLAG");//  1 查询所有机构与人员    2 查询所在部门与人员
    if(flag)this._flag = flag;
    if(this._flag == "2"){
      let user:any = this.globalData.user;
      this.organid = user.USER002;
    }
    let organid = this.navParams.get("ORGA001");
    if(organid)this.organid = organid;
    this.initData();
  }

  //初始数据
  initData() {
    this.commonService.getPage("/cts/queryOrganListById", {LIMIT: 1000,ORGA001:this.organid}).subscribe(data => {
      if (data.organList && data.organList.length >= 1) {
        this.items = data.organList;
      }
      this.commonService.getPage("/cts/queryUserinfoByOrganid", {LIMIT: 20,ORGA001:this.organid}).subscribe(data => {
        if (data.userinfoList && data.userinfoList.length >= 1) {
          this.items = this.items.concat(data.userinfoList);
        }
      });
    })
  }

  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;
    this.commonService.getPage("/cts/queryUserinfoByOrganid",
      {LIMIT: 20,START:++this.start,ORGA001:this.organid}).subscribe(data => {
        if(data.userinfoList.length > 0){
          this.items = this.items.concat(data.userinfoList);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      });
    this.globalData.showLoading = true;
  }

  //点击联系人
  clickContacts(obj){
    this.navCtrl.push('DetailsFriendsPage',{USER001:obj.USER001});
  }
  //点击单位
  clickOrgan(obj){
    this.navCtrl.push('WholeGroupPage',{ORGA001:obj.ORGA001});
  }

}
