import {Component, ElementRef, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";

/**
 * Generated class for the FriendSearchersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend-searchers',
  templateUrl: 'friend-searchers.html',
})
export class FriendSearchersPage {
  myInput:string = "";
  unRecord:boolean = false;
  items:Array<any> = [];
  items02:Array<any> = [];
  start : number = 1;
  _flag:string = "1";//FLAG  = 1  查询我的好友     = 2 查询所有用户   = 3  查询我的群组   = 4 查询我的好友和群组  = 5 查询所有用户和群组

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  constructor(public navCtrl: NavController,
              public el: ElementRef,
              public commonService : CommonService,
              public globalData : GlobalData,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendSearchersPage');
    let flag = this.navParams.get("FLAG");//FLAG  = 1  查询我的好友     = 2 查询所有用户   = 3  查询我的群组   = 4 查询我的好友和群组  = 5 查询所有用户和群组
    if(flag)this._flag = flag;
    setTimeout(()=>{
      this.el.nativeElement.querySelector(".searchbar-input").focus();
    },600);

  }

  ionClear(){
    this.navCtrl.pop();
  }

  ionCancel(){

  }

  ionInput(ev: any){
    if(!ev.target.value){
      return;
    }
    let flag01:string = "1";
    let flag02:string = "1";
    if(this._flag == "4"){
      flag01 = "1";
      flag02 = "3";
    }else if(this._flag == "5"){
      flag01 = "2";
      flag02 = "3";
    }else{
      flag01 = this._flag;
    }
   //this.infiniteScroll.enable(true);
    this.content.scrollToTop(0);
    this.globalData.showLoading = false;
    this.initOnlineList(flag01,{USER005:ev.target.value,KEYWORD:ev.target.value,START:1,LIMIT:30}).subscribe(data=>{
      let list = [];
      if(data){
        if(data.friendList){
          list = data.friendList;
        }else if(data.userinfoList){
          list = data.userinfoList;
        }
      }
      if(list.length > 0){
        this.unRecord = false;
        this.items = list;
      }else{
        this.items = [];
        this.unRecord = true;
      }
      if(this._flag == "4" || this._flag == "5"){//查询所有用户和群组
        this.globalData.showLoading = false;
        this.initOnlineList(flag02,{USER005:ev.target.value,KEYWORD:ev.target.value,START:1,LIMIT:30}).subscribe(data=>{
          let list = [];
          if(data){
            if(data.friendList){
              list = data.friendList;
            }else if(data.userinfoList){
              list = data.userinfoList;
            }
          }
          if(list.length > 0){
            this.items02 = list;
          }
        });
      }
    });
  }

  initOnlineList(flag,paramMap?){
    if(flag == "1"){
      return this.commonService.getPage('/cts/queryFriendList',paramMap);
    }else if(flag == "2"){
      return this.commonService.getPage('/cts/queryUserinfoByOrganid',paramMap);
    }else if(flag == "3"){
      return this.commonService.getPage('/cts/groups/queryMyFriendsAndGroup',paramMap);
    }else{
      return this.commonService.getPage('/cts/queryFriendList',paramMap);
    }
  }

  // doInfinite(infiniteScroll) {
  //   this.globalData.showLoading = false;
  //   this.initOnlineList({USER005:this.myInput,START:++this.start})
  //     .auditTime(500)
  //     .subscribe(data=>{
  //       if(data.onlineStudyList.length > 0){
  //         this.items = this.items.concat(data.onlineStudyList);
  //       }else{
  //         infiniteScroll.enable(false);
  //       }
  //       infiniteScroll.complete();
  //
  //     });
  //   this.globalData.showLoading = true;
  // }

  clickContacts(obj){
    this.navCtrl.push('DetailsFriendsPage',{USER001:obj.USER001});
  }
}
