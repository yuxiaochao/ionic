import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";
import {ChatMessage} from "../../../model/home/contact/chat-message/ChatMessage";
import {Utils} from "../../../providers/Utils";
import {EasemobChatService} from "../../../providers/EasemobChatService";

/**
 搜索好友列表
 */

@IonicPage()
@Component({
  selector: 'page-contact-searchers',
  templateUrl: 'contact-searchers.html',
})
export class ContactSearchersPage {
  items : any = [];
  start : number = 1;
  unRecord : boolean = false;
  myInput : string = '';
  type: boolean=false;
  items02 : any = [];//好友申请列表
  items03 : any = [];//我的申请列表

  ftpServer = "";//ftp地址

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  @ViewChild(Navbar) navbar : Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService,
              private eoChatService:EasemobChatService,
              public globalData : GlobalData,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.initData();
  }

  ionViewDidEnter(){
    if(this.myInput){
      this.items = [];
      this.start = 1;
      this.ionInput({target:{value:this.myInput}});
    }
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit');
    this.ftpServer = this.globalData.fileServer;
  }

  initData(){
    this.content.scrollToTop(0);
    this.initApplyRecordList({LIMIT:1000}).subscribe(data=>{
      if(data.applyList && data.applyList.length >= 1){
        this.items02 = data.applyList;
      }
      this.initApplicationForAddingList({LIMIT:1000}).subscribe(data=>{
        if(data.applyList && data.applyList.length >= 1){
          this.items03 = data.applyList;
        }
      });
    });
  }

  ionFocus(){
    console.log("ionFocus()");
  }

  ionCancel(obj){
    console.log("ionCancel(1)");
  }

  ionClear(obj){
    console.log("ionClear(2)");
    this.cleanData();
  }
  //清除数据
  cleanData(){
    this.content.scrollToTop(0);
    this.unRecord = false;
    this.type=false;
    this.start = 1;
    this.items = [];
  }

  ionInput(ev: any){
    this.type=true;
    if(!ev.target.value){
      this.type=false;
      return;
    }
    this.infiniteScroll.enable(true);
    //this.content.scrollToTop(0);
    this.globalData.showLoading = false;
    this.initOnlineList({KEYWORD:ev.target.value,START:1}).subscribe(data=>{
      if(data.userList.length > 0){
        this.unRecord = false;
        this.items = data.userList;
      }else{
        this.items = [];
        this.unRecord = true;
      }
    });
    this.globalData.showLoading = true;
  }

  doInfinite(infiniteScroll) {
    if(this.myInput == ""){
      infiniteScroll.enable(false);
      infiniteScroll.complete();
      return;
    }
    this.globalData.showLoading = false;
    this.initOnlineList({KEYWORD:this.myInput,START:++this.start})
      .auditTime(500)
      .subscribe(data=>{
        if(data.userList.length > 0){
          this.items = this.items.concat(data.userList);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      });
    this.globalData.showLoading = true;
  }
  //获取好友申请列表（所有别人对我的添加好友）
  initApplyRecordList(paramMap?){
    return this.commonService.getPage('/cts/queryApplyRecord',paramMap);
  }

  //获取申请添加好友列表（所有我对别人的添加好友）
  initApplicationForAddingList(paramMap?){
    return this.commonService.getPage('/cts/queryApplicationForAdding',paramMap);
  }

  //获取搜索用户列表（默认加载10条）
  initOnlineList(paramMap?){
    return this.commonService.getPage('/cts/queryUserList',paramMap);
  }

  //添加好友按钮
  addFriendButton(obj){
    this.navCtrl.push('ApplyForFriendsPage',{ITEM:obj});
  }
  //同意添加好友申请
  agreeButton(obj){
    this.commonService.getPage('/cts/addBuddy',{FRIENDID:obj.APPL002,AGREESTATE:"1"}).subscribe(data=>{
      if(data.success == 1 || data.success == "1"){
        let alert = this.alertCtrl.create({
          title: '成为好友!',
          subTitle: '您同意了好友的申请，现在可以去聊天了!',
          buttons: [{
            text: "确定",
            handler: data => {
              this.initData();
            }
          }]
        });
        alert.present();

        //推送已添加好友消息
        let hm: string = Utils.dateFormat(new Date(), "HH:mm");
        let date: string = Utils.dateFormat(new Date(), "MM-dd");
        let msgContent: ChatMessage = {msgId:new Date().getTime().toString(),
          msg:{changingThisBreaksApplicationSecurity:'您与'+this.globalData.useralias+"已经成为好友，可以开始聊天了"},
          sendingTime:hm,sendingDate:date,portrait:'newFriend',
          type:'newFriend',from:'newFriend',fromName:'新的好友',fromType:'chat'};
        this.eoChatService.sendPrivateText(msgContent,obj.APPL002);
      }
    });
  }

  //点击联系人
  clickContacts(userid){
    this.navCtrl.push('DetailsFriendsPage',{USER001:userid});
  }
}
