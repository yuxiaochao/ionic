import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {CommonService} from "../../service/CommonService";
import {GlobalData} from "../../providers/GlobalData";
import {ContactGroupSearchersPage} from "./contact-group-searchers/contact-group-searchers";
import {WholeGroupPage} from "./whole-group/whole-group";
import {MyFriendsPage} from "./my-friends/my-friends";


@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  /****************  页面变量 start ****************/
  alphaSidebar_top;
  alphaSidebarP_marginBottom;
  /****************  页面变量 end ****************/

  contactItems: any = [];

  //@ViewChild('alpha_sidebar') alpha_sidebar:ElementRef;
  @ViewChild('headerEle', {read: ElementRef}) headerEle: ElementRef;
  @ViewChild('divList', {read: ElementRef}) divList: ElementRef;

  constructor(public navCtrl: NavController,
              public commonService: CommonService,
              private el: ElementRef,
              public renderer: Renderer2,
              public globalData: GlobalData) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad(1)");
    //this.initSidebar();
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter(2)");
    this.initData({});
  }

  //初始数据
  initData(params) {
    this.globalData.showLoading = false;
    this.requestDataList("/cts/topContacts", {LIMIT: 30}).subscribe(data => {
      if (data.contactsList && data.contactsList.length >= 1) {
        let friendList = data.contactsList;
        let currentLetter = "";//当前字母
        for (let i = 0; i < friendList.length; i++) {
          let friendnow = friendList[i];
          let nextFriend;
          if (friendList.length > i + 1) {
            nextFriend = friendList[i + 1];
          } else {
            nextFriend = null;
          }
          let headLetter = friendnow.USER023;
          if (currentLetter != headLetter) {//判断数据是否该字母头一条数据
            currentLetter = headLetter;
            friendnow.isFirstData = true;
          } else {
            currentLetter = headLetter;
            friendnow.isFirstData = false;
          }
          if (!nextFriend) {//判断数据是否该字母最后一条数据
            friendnow.isLastData = true;
          } else {
            //let nextHeadLetter = nextFriend.USER023;
            if (currentLetter != headLetter) {
              friendnow.isLastData = true;
            } else {
              friendnow.isLastData = false;
            }
          }
        }
        this.contactItems = friendList;
      } else {
        this.contactItems = [];
      }
      if (params.callback) {
        params.callback();
      }//回调函数
    });
    this.globalData.showLoading = true;
  }

////初始化字母栏
//   initSidebar(){
//     let tabHeig = this.navCtrl.parent._tabbar.nativeElement.clientHeight;
//     let headHeig = this.headerEle.nativeElement.clientHeight;
//     let cliHeig = this.el.nativeElement.clientHeight - tabHeig - headHeig;
//     //let cliWidt = this.el.nativeElement.clientWidth;
//     let lis = this.alpha_sidebar.nativeElement.children;
//     this.alphaSidebar_top = headHeig + 8;
//     let liMaxHeig = cliHeig / 27;
//     for(let i=0;i<lis.length;i++){
//       let linow = lis[i];
//       let liHeig = linow.clientHeight;
//       if(liMaxHeig > liHeig){
//         this.renderer.setStyle(linow,"margin-bottom",(liMaxHeig - liHeig) + "px");
//       }else{
//         this.renderer.setStyle(linow,"margin-bottom","0px");
//       }
//     }
//   }

  //获取列表（默认加载10条）
  requestDataList(url: string, paramMap?) {
    return this.commonService.getPage(url, paramMap);
  }

  //添加好友方法
  myFriends() {
    this.navCtrl.push('MyFriendsPage');
  }

  //我的群聊
  myGroupChat() {
    this.navCtrl.push('ContactGroupSearchersPage');
  }

  //全员群
  quanyuanqun() {
    this.navCtrl.push('WholeGroupPage');
  }

  //部门群
  bumenqun() {
    this.navCtrl.push('WholeGroupPage', {});
  }

  //点击联系人
  clickContacts(obj) {
    this.navCtrl.push('ChatMessagePage', {thisUserId: obj.USER001});
  }

  //创建群组
  createGroup() {
    let flage = 0;//判断创建还是修改 0创建   1修改
    this.navCtrl.push('ContactgroupcreatPage', {FLAGE: flage});
  }

  /**
   * 点击字母
   */
  gotoList(zimu) {
    // let obj = this.divList.nativeElement.querySelector("#"+zimu);
    // if(obj){
    //   obj.scrollIntoView(true);
    // }
  }

  /**
   * 点击搜索框
   */
  clickJiadesousuokuang() {
    //FLAG  = 1  查询我的好友     = 2 查询所有用户   = 3  查询我的群组   = 4 查询我的好友和群组  = 5 查询所有用户和群组
    this.navCtrl.push("FriendSearchersPage", {FLAG: 5});
  }

}
