import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";
import {CommonService} from "../../../service/CommonService";
import {EasemobChatService} from "../../../providers/EasemobChatService";
import {GlobalData} from "../../../providers/GlobalData";
import {Utils} from "../../../providers/Utils";
import {HttpService} from "../../../providers/HttpService";
import {ChatMessage} from "../../../model/home/contact/chat-message/chatMessage";
import {ChatSettingsPage} from "../chat-settings/chat-settings";

/**
 * Generated class for the ChatMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-message',
  templateUrl: 'chat-message.html',
})
export class ChatMessagePage {

  myInput: string = "";//用户的输入
  expHdItemNam: number = 1;//表情tab
  isOpenWechatFace: boolean = false;
  //historyTxts: Array<string> = [];//历史消息文件（名称）列表
  historyItems: Array<ChatMessage> = [];//历史消息记录
  items = [];
  otherParty: string;//聊天对象（对方userid）
  otherUser: any = {};//聊天对象用户信息
  box_hd_isShow: boolean = false;//是否显示“没有更多信息了”
  unread_number:number = 0;//用户未读信息数

  //isMobile: boolean = false;//是否真机
  //mobile: string = "";//设备标识   android   ios
  //dataDirectory: string = "";//文件储存目录

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Navbar) navbar: Navbar;
  @ViewChild('editArea') alpha_sidebar: ElementRef;
  @ViewChild('exp_cont') exp_cont: ElementRef;
  @ViewChild('box_ft_hd') box_ft_hd: ElementRef;
  @ViewChild('messageList') messageList: ElementRef;

  constructor(public navCtrl: NavController,
              public renderer: Renderer2,
              private sanitizer: DomSanitizer,
              public commonService: CommonService,
              public navParams: NavParams,
              public mobChat: EasemobChatService,
              private globalData: GlobalData,
              private httpService: HttpService) {
  }

  ionViewDidLoad() {//加载完页面执行一次
    console.log('ionViewDidLoad ChatMessagePage');
    this.otherParty = this.navParams.get("thisUserId");//获取聊天对象userid
    this.initPage();//初始化页面布局
    this.initData();//初始化数据
    this.bindExpCont();//绑定点击表情事件
    this.bindReceiveMsg({isInside:true});//绑定接受信息方法
  }

  ionViewDidEnter() {//每进一次页面执行一次

  }

  ionViewWillLeave(){//离开页面事件
    this.bindReceiveMsg({isInside:false});//绑定接受信息方法
    this.mobChat.unsetShowUnread();//取消绑定显示数字方法
  }

//初始化页面布局
  initPage() {
    this.infiniteScroll.enable(false);
    let box_ft_hd_Width = this.box_ft_hd.nativeElement.offsetWidth;
    let pre = this.box_ft_hd.nativeElement.children[0].children[0];
    this.renderer.setStyle(pre, "width", box_ft_hd_Width - 66 + "px");//固定输入框的宽度
    //查询对方用户信息
    this.queryOtherUser((data) => {
    });
  }

  //初始化数据
  initData() {
    this.mobChat.initHistoryData(this.otherParty,"chat").then(req=>{
      this.mobChat.readHistoryTxt(this.historyItems,this.otherParty,"chat").then(req => {
        if (req) {
          this.readHistoryItems(20).then(req => {
            setTimeout(()=>{
              this.content.scrollToBottom(0).then(req=>{
                if(this.items.length == 20){
                  this.infiniteScroll.enable(true);
                }
              });//滑到页面最底部
            },0)
          });//读取历史信息了
        }
        //获得用户未读数量
        this.unread_number = this.mobChat.getUnreadNumber();
        this.bingUnreadNumber();
      })
    })
  }

//读取historyItems，显示到页面上
  readHistoryItems(limit: number): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.historyItems && this.historyItems.length >= limit) {
        for (let i = 0; i < limit; i++) {
          if (this.historyItems.length >= 1) {
            let item = this.historyItems.pop();//删除
            this.pushMesList(item, 2);
          }
        }
        resolve(true);//读取完毕
      } else {
        this.mobChat.readHistoryTxt(this.historyItems,this.otherParty,"chat").then(req => {
          if (req) {
            this.readHistoryItems(limit).then(req02 => {
              resolve(req02);
            });
          } else {
            while (this.historyItems.length >= 1) {
              let item = this.historyItems.pop();//删除
              this.pushMesList(item, 2);
            }
            resolve(false);//所有历史信息已经读完了
          }
        })
      }
    });
  }

//向上滑动加载更多历史信息
  doInfinite(infiniteScroll) {
    console.log("infiniteScroll");
    this.readHistoryItems(10).then(req => {
      if (!req) {//历史记录已经读取完成
        this.box_hd_isShow = true;
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    });
  }

  cliWebWechatFace() {
    this.isOpenWechatFace = !this.isOpenWechatFace;
  }

  cliExpHdItem(num) {
    this.expHdItemNam = num;
  }

  //绑定点击表情事件
  bindExpCont() {
    let as = this.exp_cont.nativeElement.children;
    for (let i = 0; i < as.length; i++) {
      let anow = as[i];
      anow.addEventListener("click", (o) => {
        this.cliExpCont(o);
      });
    }
  }

  //点击输入框
  cliInput() {
    this.isOpenWechatFace = false;//隐藏表情
    setTimeout(()=>{
      this.content.scrollToBottom(0);//滑到页面最底部
    },300)
  }

  //点击表情
  cliExpCont(obj) {
    let html = '<img class="' + obj.currentTarget.className + ' activated02" title="' + obj.currentTarget.innerHTML + '" src="./assets/imgs/common/touming2.png">';
    let nowHtml = this.alpha_sidebar.nativeElement.innerHTML;
    this.alpha_sidebar.nativeElement.innerHTML = nowHtml + html;
    this.myInput = nowHtml + html;
  }

  //同步信息
  changeMsg() {
    let nowHtml = this.alpha_sidebar.nativeElement.innerHTML;
    this.myInput = nowHtml;
  }

//发送信息
  sendMsg(str) {
    this.alpha_sidebar.nativeElement.focus();//获得焦点
    let hm: string = Utils.dateFormat(new Date(), "HH:mm");
    let date: string = Utils.dateFormat(new Date(), "MM-dd");
    let msgObj: ChatMessage = {
      msgId: new Date().getTime().toString(),
      msg: this.sanitizer.bypassSecurityTrustHtml(this.myInput),
      sendingTime: hm,
      sex:this.globalData.user.USER006,
      type: "me",
      from: this.globalData.userId,
      fromName : this.globalData.useralias,
      fromType: "chat",
      sendingDate: date,
      userId:this.globalData.userId,
      userName:this.globalData.useralias,
      portrait:this.globalData.user.ATTA007
    };
    this.pushMesList(msgObj, 1);//显示到页面上
    this.mobChat.sendPrivateText(msgObj, this.otherParty);//发送消息给环信
    this.mobChat.writeHistoryTxt(msgObj, this.otherParty, "chat", this.otherUser);//把聊天信息写入历史文件
    this.isOpenWechatFace = false;//把标签隐藏
    this.alpha_sidebar.nativeElement.innerHTML = "";//清空输入框
    this.myInput = "";//清空内容
    setTimeout(()=>{
      this.content.scrollToBottom(0);//滑到页面最底部
    },0)
  }

  //绑定接收信息方法
  bindReceiveMsg({isInside}:{isInside:boolean}) {
    this.mobChat.setCurrentWindow({
      isInside: isInside,
      userId: this.globalData.userId,
      to: this.otherParty,
      processingMsgMethod: (m) => {
        this.receiveMsg(m)
        setTimeout(()=>{
          this.content.scrollToBottom(0);//滑到页面最底部
        },0)
      }
    });
  }

//接收到好友消息
  receiveMsg(msg) {
    if (!this.otherUser) {
      this.queryOtherUser((data) => {
        let portrait = data.ATTA007;
        let sex = data.USER006;
        let msgObj: ChatMessage = {portrait: portrait, sex: sex, ...msg};
        this.pushMesList(msgObj, 1);
        //this.mobChat.writeHistoryTxt(msgObj, this.otherParty, "chat");//把聊天信息写入历史文件
      });
    } else {
      let portrait = this.otherUser.ATTA007;
      let sex = this.otherUser.USER006;
      let msgObj: ChatMessage = {portrait: portrait, sex: sex, ...msg};
      this.pushMesList(msgObj, 1);
      //this.mobChat.writeHistoryTxt(msgObj, this.otherParty, "chat");//把聊天信息写入历史文件
    }
  }

  //查询对方用户的基本信息
  queryOtherUser(callback) {
    if (this.otherParty) {
      this.globalData.showLoading = false;
      this.httpService.postFormData('/mine/userInfo', {
        'USER001': this.otherParty
      }).subscribe(data => {
        if (data) {
          this.otherUser = data.userInfo;
          try {
            callback(this.otherUser);
          } catch (e) {
          }
        }
      });
      this.globalData.showLoading = true;
    }
  }

  //把消息放到消息list
  pushMesList(obj: ChatMessage, direction: number) {
    let msgBody = {
      type: "others",
      portrait: "",
      sex: "男",
      sendingTime: Utils.dateFormat(new Date(), "HH:mm"),
      ...obj
    };
    if (msgBody.type == "me") {
      msgBody.portrait = this.globalData.user.ATTA007;
    }
    if (direction == 1) {//加到数组末尾
      this.items.push(msgBody);
    } else if (direction == 2) {//加到数组头部
      this.items.unshift(msgBody);
    }
  }

  /**
   * 返回
   */
  back(){
    this.navCtrl.pop();
  }

  /**
   * 绑定刷新未读数方法
   */
  bingUnreadNumber(){
    this.mobChat.setShowUnread(()=>{
      this.unread_number = this.mobChat.getUnreadNumber();
    });
  }

  /**
   * 用户设置
   */
  morePopover(){
    this.navCtrl.push("ChatSettingsPage",{USERID:this.otherParty});
  }
}
