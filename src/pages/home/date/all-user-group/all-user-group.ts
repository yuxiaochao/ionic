import {Component, ViewChild} from '@angular/core';
import {InfiniteScroll, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GlobalData} from "../../../../providers/GlobalData";
import {CommonService} from "../../../../service/CommonService";


@IonicPage()
@Component({
  selector: 'page-all-user-group',
  templateUrl: 'all-user-group.html',
})
export class AllUserGroupPage {

  items: any = [];
  organid: string = '';//机构id
  start: number = 1;
  _flag: string = "1";//  1 查询所有机构与人员    2 查询所在部门与人员
  callback: any;
  callbackRoot: any;
  optionType: string;
  relationship: string;
  tabIndex: number = 2;
  checkOption:any=[];
  thisType:number;

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public globalData: GlobalData,
              public commonService: CommonService) {
  }

  ionViewDidLoad() {
    let ch = this.navParams.get('checkOption');
    this.checkOption = ch?ch:[];
    this.thisType = this.navParams.get('thisType');
    this.callback = this.navParams.get("callback");
    this.callbackRoot = this.navParams.get('callbackRoot');
    this.optionType = this.navParams.get("optionType");
    this.tabIndex = this.navParams.get("tabIndex")
    == undefined
    || this.navParams.get('tabIndex') == null ? 2 : this.navParams.get('tabIndex');
    let flag = this.navParams.get("FLAG");//  1 查询所有机构与人员    2 查询所在部门与人员
    if (flag) this._flag = flag;
    if (this._flag == "2") {
      let user: any = this.globalData.user;
      this.organid = user.USER002;
    }
    let organid = this.navParams.get("ORGA001");
    if (organid) this.organid = organid;
    this.initData();
  }

  //初始数据
  initData() {
    this.commonService.getPage("/cts/queryOrganListById", {LIMIT: 1000, ORGA001: this.organid}).subscribe(data => {
      if (data.organList && data.organList.length >= 1) {
        this.items = data.organList;
      }
      this.commonService.getPage("/cts/queryUserinfoByOrganid", {LIMIT: 20, ORGA001: this.organid}).subscribe(data => {
        if (data.userinfoList && data.userinfoList.length >= 1) {
          this.items = this.items.concat(data.userinfoList);
        }
      });
    })
  }

  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;
    this.commonService.getPage("/cts/queryUserinfoByOrganid",
      {LIMIT: 20, START: ++this.start, ORGA001: this.organid}).subscribe(data => {
      if (data.userinfoList.length > 0) {
        this.items = this.items.concat(data.userinfoList);
      } else {
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();

    });
    this.globalData.showLoading = true;
  }

  //点击单位
  clickOrgan(obj) {
    this.navCtrl.push('AllUserGroupPage', {
      callback: (data) => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      },
      callbackRoot: this.callbackRoot,
      optionType: this.optionType,
      ORGA001: obj.ORGA001,
      tabIndex: ++this.tabIndex,
      thisType:this.thisType,
      checkOption:this.checkOption
    });
  }

  toSelect() {
    this.navCtrl.push('HyorganizationmanPage', {
      option: this.relationship,
      callback: this.callbackRoot,
      optionType: this.optionType,
      thisType:this.thisType
    });

    console.log(this.navCtrl.getViews());
    if(this.thisType==1){
      for (let i = 0; i < this.tabIndex; i++) {
        this.navCtrl.remove(3);
      }
    }else{
      for (let i = 0; i < this.tabIndex; i++) {
        this.navCtrl.remove(2);
      }
    }
  }

  isFinish(){
    this.items.forEach(item=>{
      if(item.check&&item.check==true){
        this.checkOption.push(item.USER001);
      }
    });
    console.log(this.navCtrl.getViews());
    this.navCtrl.push('HyorganizationmanPage', {
      checkOption:this.checkOption,
      callback:this.callbackRoot,
      optionType:this.optionType
    });
    if(this.thisType>0){
      for (let i = 0; i < this.tabIndex; i++) {
        this.navCtrl.remove(2+this.thisType);
      }
    }else{
      for (let i = 0; i < this.tabIndex; i++) {
        this.navCtrl.remove(2);
      }
    }
  }

}
