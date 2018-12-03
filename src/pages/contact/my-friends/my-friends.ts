import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GlobalData} from "../../../providers/GlobalData";
import {CommonService} from "../../../service/CommonService";

/**
 * Generated class for the MyFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-friends',
  templateUrl: 'my-friends.html',
})
export class MyFriendsPage {

  /****************  页面变量 start ****************/
  alphaSidebar_top;
  alphaSidebarP_marginBottom;
  /****************  页面变量 end ****************/

  contactItems:any = [];
  ruler: any=[];
  letter: string='A';
  treem:  number=0;
  arr:any =[{ss:'A'},{ss:'B'},{ss:'C'},{ss:'D'},{ss:'E'},{ss:'F'},{ss:'G'},{ss:'H'},{ss:'I'},{ss:'J'},{ss:'K'},{ss:'L'},{ss:'M'},{ss:'N'},{ss:'O'},{ss:'P'},{ss:'Q'},{ss:'R'},{ss:'S'},{ss:'T'},{ss:'U'},{ss:'V'},{ss:'W'},{ss:'X'},{ss:'Y'},{ss:'Z'},{ss:'#'},];

  @ViewChild('alpha_sidebar') alpha_sidebar:ElementRef;
  @ViewChild('headerEle',{read:ElementRef}) headerEle:ElementRef;
  @ViewChild('divList',{read:ElementRef}) divList:ElementRef;
  constructor(public navCtrl: NavController,public commonService : CommonService,private el: ElementRef,public renderer:Renderer2,public globalData : GlobalData) {
  }
  ionViewDidLoad(){
    console.log("ionViewDidLoad(1)");
    this.initSidebar();
  }
  ionViewDidEnter(){
    console.log("ionViewDidEnter(2)");
    this.initData({});
  }

  //初始数据
  initData(params) {
    this.globalData.showLoading = false;
    this.requestDataList("/cts/queryFriendList", {LIMIT:1000,CONT004:1}).subscribe(data => {
      if (data.friendList && data.friendList.length >= 1) {
        let friendList = data.friendList;
        let currentLetter = "";//当前字母
        for(let i=0;i<friendList.length;i++){
          let friendnow = friendList[i];
          let nextFriend;
          if(friendList.length > i+1){
            nextFriend = friendList[i+1];
          }else{
            nextFriend = null;
          }
          let headLetter = friendnow.USER023;
          if(currentLetter != headLetter){//判断数据是否该字母头一条数据
            currentLetter = headLetter;
            friendnow.isFirstData = true;
          }else{
            currentLetter = headLetter;
            friendnow.isFirstData = false;
          }
          if(!nextFriend){//判断数据是否该字母最后一条数据
            friendnow.isLastData = true;
          }else{
            //let nextHeadLetter = nextFriend.USER023;
            if(currentLetter != headLetter){
              friendnow.isLastData = true;
            }else{
              friendnow.isLastData = false;
            }
          }
        }
        this.contactItems = friendList;
      }else{
        this.contactItems = [];
      }
      if(params.callback){params.callback();}//回调函数
    });
    this.globalData.showLoading = true;
  }

//初始化字母栏
  initSidebar(){
    // let tabHeig = this.navCtrl.parent._tabbar.nativeElement.clientHeight;
    let headHeig = this.headerEle.nativeElement.clientHeight;
    // let cliHeig = this.el.nativeElement.clientHeight - tabHeig - headHeig;
    //let cliWidt = this.el.nativeElement.clientWidth;
    // let lis = this.alpha_sidebar.nativeElement.children;
    this.alphaSidebar_top = headHeig + 36;
    // let liMaxHeig = cliHeig / 27;
    // for(let i=0;i<lis.length;i++){
    //   let linow = lis[i];
    //   let liHeig = linow.clientHeight;
    //   if(liMaxHeig > liHeig){
    //     this.renderer.setStyle(linow,"margin-bottom",(liMaxHeig - liHeig) + "px");
    //   }else{
    //     this.renderer.setStyle(linow,"margin-bottom","0px");
    //   }
    // }

    this.ruler=this.arr;
    console.log(this.arr);
  }

  //获取列表（默认加载10条）
  requestDataList(url:string,paramMap?){
    return this.commonService.getPage(url,paramMap);
  }

  //添加好友方法
  addFriends(){
    this.navCtrl.push('ContactSearchersPage');
  }
  //班级讨论组
  classDiscussionGroup(){

  }
  //我的群聊
  myGroupChat(){
    this.navCtrl.push('ContactGroupSearchersPage');
  }
  //点击联系人
  clickContacts(obj){
    this.navCtrl.push('DetailsFriendsPage',{USER001:obj.USER001});
  }

  /**
   * 点击字母
   */
  gotoList(zimu){
    let obj = this.divList.nativeElement.querySelector("#"+zimu);
    if(obj){
      obj.scrollIntoView(true);
    }
  }

  /**
   * 点击搜索框
   */
  clickJiadesousuokuang(){
    //FLAG  = 1  查询我的好友     = 2 查询所有用户   = 3  查询我的群组   = 4 查询我的好友和群组  = 5 查询所有用户和群组
    this.navCtrl.push("FriendSearchersPage",{FLAG:1});
    // this.navCtrl.push('ContactSearchersPage');
  }

  onoverdo(item){

    for(let i=0;i<this.arr.length;i++){
      this.arr[i].cur=0;
    }
    item.cur=1;
    this.letter=item;
    this.treem=1;
  }

  onoutdo(){
    setTimeout( ()=>{
      this.treem=0;
    },300)
  }


}
