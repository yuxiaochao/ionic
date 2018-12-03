import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../../service/CommonService";
import {GlobalData} from "../../../../../providers/GlobalData";
import {Utils} from "../../../../../providers/Utils";
import {ChatMessage} from "../../../../../model/home/contact/chat-message/ChatMessage";
import {EasemobChatService} from "../../../../../providers/EasemobChatService";

/**
 * Generated class for the GroupAddPeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-add-people',
  templateUrl: 'group-add-people.html',
})
export class GroupAddPeoplePage {

  /****************  页面变量 start ****************/
  alphaSidebar_top;
  alphaSidebarP_marginBottom;
  /****************  页面变量 end ****************/

  GROU001:string=''//群组ID
  GROU002:string=''//群名称
  contactItems:any = [];
  ruler: any=[];
  letter: string='A';
  treem:  number=0;
  arr:any =[{ss:'A'},{ss:'B'},{ss:'C'},{ss:'D'},{ss:'E'},{ss:'F'},{ss:'G'},{ss:'H'},{ss:'I'},{ss:'J'},{ss:'K'},{ss:'L'},{ss:'M'},{ss:'N'},{ss:'O'},{ss:'P'},{ss:'Q'},{ss:'R'},{ss:'S'},{ss:'T'},{ss:'U'},{ss:'V'},{ss:'W'},{ss:'X'},{ss:'Y'},{ss:'Z'},{ss:'#'},];

  @ViewChild('alpha_sidebar') alpha_sidebar:ElementRef;
  @ViewChild('headerEle',{read:ElementRef}) headerEle:ElementRef;
  @ViewChild('divList',{read:ElementRef}) divList:ElementRef;
  constructor(public navCtrl: NavController,
               public navParam:NavParams,
              public commonService : CommonService,
              private el: ElementRef,
              public renderer:Renderer2,
              public globalData : GlobalData,
              public alert:AlertController,
              private eoChatService:EasemobChatService,) {
  }

  ionViewDidLoad(){
    this.GROU001=this.navParam.get('GROU001');
    this.GROU002=this.navParam.get("GROU002");
    console.log("ionViewDidLoad(1)");
    //this.initSidebar();
  }
  ionViewDidEnter(){
    console.log("ionViewDidEnter(2)");
    this.initData({});
  }

  //初始数据 /cts/queryFriendList LIMIT:1000,CONT004:1
  initData(params) {
    this.globalData.showLoading = false;
    this.requestDataList("/cts/groups/queryMemberNotInGroup", {USER001:this.globalData.userId,GROU001:this.GROU001}).subscribe(data => {
      if (data.noticeList && data.noticeList.length >= 1) {
        let friendList = data.noticeList;
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
//   initSidebar(){
//     // let tabHeig = this.navCtrl.parent._tabbar.nativeElement.clientHeight;
//     let headHeig = this.headerEle.nativeElement.clientHeight;
//     // let cliHeig = this.el.nativeElement.clientHeight - tabHeig - headHeig;
//     //let cliWidt = this.el.nativeElement.clientWidth;
//     // let lis = this.alpha_sidebar.nativeElement.children;
//     this.alphaSidebar_top = headHeig + 36;
//     // let liMaxHeig = cliHeig / 27;
//     // for(let i=0;i<lis.length;i++){
//     //   let linow = lis[i];
//     //   let liHeig = linow.clientHeight;
//     //   if(liMaxHeig > liHeig){
//     //     this.renderer.setStyle(linow,"margin-bottom",(liMaxHeig - liHeig) + "px");
//     //   }else{
//     //     this.renderer.setStyle(linow,"margin-bottom","0px");
//     //   }
//     // }
//     debugger
//     this.ruler=this.arr;
//     console.log(this.arr);
//   }

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

  //邀请好友进群
  invitingFriends(obj){

    this.commonService.getPage('/cts/groups/addUserToGroup',{
      grou001:this.GROU001,
      usgr003:obj,
      usgr006:this.globalData.userId,
      usgr004:1
    }).auditTime(500).subscribe(data=>{
      if(data.success==1){

        let alert=this.alert.create({
          title:'邀请成功！',
          buttons:[{
              text:'确定',
               handler:()=>{
                this.initData({});
              }
           }]
        }).present()

        //推送添加好友消息
        let hm: string = Utils.dateFormat(new Date(), "HH:mm");
        let date: string = Utils.dateFormat(new Date(), "MM-dd");
        let msgContent: ChatMessage = {msgId:new Date().getTime().toString(),
          msg:{changingThisBreaksApplicationSecurity:this.globalData.useralias+'邀请您加入'+this.GROU002+'群'},
          sendingTime:hm,sendingDate:date,portrait:'',
          type:'me',from:this.GROU001,fromName:this.GROU002,fromType:'group'};
        this.eoChatService.sendPrivateText(msgContent,obj);
      }

      })


  }
}
