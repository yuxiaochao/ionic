import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {ChatMessage} from "../../../model/home/contact/chat-message/ChatMessage";
import {GlobalData} from "../../../providers/GlobalData";
import {HttpService} from "../../../providers/HttpService";
import {EasemobChatService} from "../../../providers/EasemobChatService";
import {CommonService} from "../../../service/CommonService";
import {DomSanitizer} from "@angular/platform-browser";
import {ContactGroupChatMessageSetupPage} from "./contact-group-chat-message-setup/contact-group-chat-message-setup";
import {Utils} from "../../../providers/Utils";

/**
 * Generated class for the ContactGroupChatMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-group-chat-message',
  templateUrl: 'contact-group-chat-message.html',
})
export class ContactGroupChatMessagePage {
   GROU002 = "";//群名儿
   GROU001="";//群组id
  item ; any={};
   myInput: string = "";//用户的输入
   expHdItemNam: number = 1;//表情tab
   isOpenWechatFace: boolean = false;
   //historyTxts: Array<string> = [];//历史消息文件（名称）列表
   historyItems: Array<ChatMessage> = [];//历史消息记录
   items = [];
    otherParty: string;//聊天对象（对方userid）
    otherUsers: any = {};//聊天对象用户信息
    box_hd_isShow: boolean = false;//是否显示“没有更多信息了”
    unread_number:number = 0;//用户未读信息数

    //isMobile: boolean = false;//是否真机
    //mobile: string = "";//设备标识   android   ios
    //dataDirectory: string = "";//文件储存目录
    msg: string = "123";//测试信息

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
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactGroupChatMessagePage');
    this.item=this.navParams.get('ITEM');
    this.GROU002=this.item.GROU002
    this.GROU001=this.item.GROU001

    this.otherParty = this.item.GROU004;//获取环信群id
    this.initPage();//初始化页面布局
    this.initData();//初始化数据
    this.bindExpCont();//绑定点击表情事件
    this.bindReceiveMsg({isInside:true});//绑定接受信息方法

  }
  ionViewWillEnter(){

    this.GROU002=this.item.GROU002

  }

  ionViewDidEnter() {//每进一次页面执行一次

  }

  ionViewWillLeave(){//离开页面事件
    this.bindReceiveMsg({isInside:false});//绑定接受信息方法
    this.mobChat.unsetShowUnread();//取消绑定显示数字方法
  }


  //设置
  morePopover(){

     this.navCtrl.push('ContactGroupChatMessageSetupPage',{ITEM:this.item});
  }

  cliExpHdItem(num) {
    this.expHdItemNam = num;
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

  //查询群组成员的基本信息
  queryOtherUser(callback) {
    if (this.GROU001) {
      this.httpService.postFormData('/cts/groups/queryGroupDetails', {
        'USER001':this.globalData.userId,
        'GROU001': this.GROU001,
      }).subscribe(data => {
        if (data) {
          let groupMemberList = data.groupMemberList;
          for(let thisGroupUser of groupMemberList){
            this.otherUsers[thisGroupUser["USER001"]] = thisGroupUser;
          }
          console.log(this.otherUsers)
          try {
            callback(this.otherUsers);
          } catch (e) {
          }
        }
      });
    }
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

  //发送信息
  sendMsg() {
    this.alpha_sidebar.nativeElement.focus();//获得焦点
    let hm: string = Utils.dateFormat(new Date(), "HH:mm");
    let date: string = Utils.dateFormat(new Date(), "MM-dd");
    let msgObj: ChatMessage = {
      msgId: new Date().getTime().toString(),
      msg: this.sanitizer.bypassSecurityTrustHtml(this.myInput),
      sendingTime: hm,
      type: "me",
      from: this.otherParty,//环信群id
      fromName : this.GROU002,//群名称
      fromType: "group",
      sendingDate: date,
      portrait:'group',//群组暂时用默认头像
      userId:this.globalData.userId,//发信息人id
      userName:this.globalData.useralias,
      userPortrait:""
    };
    this.pushMesList(msgObj, 1);//显示到页面上
    this.mobChat.sendPrivateText(msgObj, this.otherParty);//发送消息给环信
    this.mobChat.writeHistoryTxt(msgObj, this.otherParty, "group");//把聊天信息写入历史文件
    this.isOpenWechatFace = false;//把标签隐藏
    this.alpha_sidebar.nativeElement.innerHTML = "";//清空输入框
    this.myInput = "";//清空内容
    setTimeout(()=>{
      this.content.scrollToBottom(0);//滑到页面最底部
    },0)
  }

  cliWebWechatFace() {
    this.isOpenWechatFace = !this.isOpenWechatFace;
  }

  //绑定接收信息方法
  bindReceiveMsg({isInside}:{isInside:boolean}) {
    this.mobChat.setCurrentWindow({
      isInside: isInside,
      userId: this.globalData.userId,
      to: this.otherParty,
      processingMsgMethod: (m) => {
        this.receiveMsg(m);
        setTimeout(()=>{
          this.content.scrollToBottom(0);//滑到页面最底部
        },0)
      }
    });
  }

  //接收到好友消息
  receiveMsg(msg) {
    if (!this.otherUsers[msg.userId]) {
      this.queryOtherUser((data) => {
        let portrait = data[msg.userId].ATTA007;
        let sex = data[msg.userId].USER006;
        let firstName = data[msg.userId].FIRSTNAME;
        let msgObj: ChatMessage = { ...msg,userPortrait: portrait, sex: sex,userName:firstName};
        this.pushMesList(msgObj, 1);
      });
    } else {
      let portrait = this.otherUsers[msg.userId].ATTA007;
      let sex = this.otherUsers[msg.userId].USER006;
      let firstName = this.otherUsers[msg.userId].FIRSTNAME;
      let msgObj: ChatMessage = { ...msg,userPortrait: portrait, sex: sex,userName:firstName};
      this.pushMesList(msgObj, 1);
    }
  }

  //同步信息
  changeMsg() {
    let nowHtml = this.alpha_sidebar.nativeElement.innerHTML;
    this.myInput = nowHtml;
  }

  //把消息放到消息list
  pushMesList(obj: ChatMessage, direction: number) {
    let msgBody = {
      type: "others",
      userPortrait: "",
      sex: "男",
      sendingTime: Utils.dateFormat(new Date(), "HH:mm"),
      ...obj
    };
    if (msgBody.type == "me") {
      msgBody.userPortrait = this.globalData.user.ATTA007;
    }
    if (direction == 1) {//加到数组末尾
      this.items.push(msgBody);
    } else if (direction == 2) {//加到数组头部
      this.items.unshift(msgBody);
    }
  }

  //点击表情
  cliExpCont(obj) {
    let html = '<img class="' + obj.currentTarget.className + ' activated02" title="' + obj.currentTarget.innerHTML + '" src="./assets/imgs/common/touming2.png">';
    let nowHtml = this.alpha_sidebar.nativeElement.innerHTML;
    this.alpha_sidebar.nativeElement.innerHTML = nowHtml + html;
    this.myInput = nowHtml + html;
  }

  //初始化数据
  initData() {
    this.mobChat.initHistoryData(this.otherParty,"group").then(req=>{
      this.mobChat.readHistoryTxt(this.historyItems,this.otherParty,"group").then(req => {
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
        this.mobChat.readHistoryTxt(this.historyItems,this.otherParty,"group").then(req => {
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
  /**
   * 绑定刷新未读数方法
   */
  bingUnreadNumber(){
    this.mobChat.setShowUnread(()=>{
      this.unread_number = this.mobChat.getUnreadNumber();
    });
  }


}
