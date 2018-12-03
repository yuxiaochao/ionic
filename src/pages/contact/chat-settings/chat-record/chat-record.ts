import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from "@angular/platform-browser";
import {ChatMessage} from "../../../../model/home/contact/chat-message/ChatMessage";
import {CommonService} from "../../../../service/CommonService";
import {EasemobChatService} from "../../../../providers/EasemobChatService";
import {GlobalData} from "../../../../providers/GlobalData";
import {HttpService} from "../../../../providers/HttpService";
import {Utils} from "../../../../providers/Utils";


/**
 * Generated class for the ChatMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-record',
  templateUrl: 'chat-record.html',
})
export class ChatRecordPage {

  myInput: string = "";//用户的输入
  expHdItemNam: number = 1;//表情tab
  isOpenWechatFace: boolean = false;
  //historyTxts: Array<string> = [];//历史消息文件（名称）列表
  historyItems: Array<ChatMessage> = [];//历史消息记录
  items = [];
  otherParty: string;//聊天对象（对方userid）
  otherUser: any = {};//聊天对象用户信息
  box_hd_isShow: boolean = true;//是否显示“没有更多信息了”
  unread_number: number = 0;//用户未读信息数

  //isMobile: boolean = false;//是否真机
  //mobile: string = "";//设备标识   android   ios
  //dataDirectory: string = "";//文件储存目录
  msg: string = "123";//测试信息
  start:number=1;

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Navbar) navbar: Navbar;
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
    this.otherParty = this.navParams.get("thisUSERID");//获取聊天对象userid
    this.initPage();//初始化页面布局
    this.initData();//初始化数据
  }

  ionViewDidEnter() {//每进一次页面执行一次
  }

  ionViewWillLeave() {//离开页面事件
    this.mobChat.unsetShowUnread();//取消绑定显示数字方法
  }

  //初始化页面布局
  initPage() {
    //查询对方用户信息
    this.queryOtherUser((data) => {
    });
  }

  //初始化数据
  initData() {
    this.initChatRecord({START: 1,otherUserid: this.otherParty}).subscribe(data => {
      this.items = data.chatRecord;
    });
    this.bingUnreadNumber();
  }

  initChatRecord(param){
    return this.commonService.getPage('/cts/chatRecord', param);
  }

  cliWebWechatFace() {
    this.isOpenWechatFace = !this.isOpenWechatFace;
  }

  cliExpHdItem(num) {
    this.expHdItemNam = num;
  }

  //查询对方用户的基本信息
  queryOtherUser(callback) {
    if (this.otherParty) {
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
      //TODO 获取用户头像
      msgBody.portrait = "";
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
  back() {
    this.navCtrl.pop();
  }

  /**
   * 绑定刷新未读数方法
   */
  bingUnreadNumber() {
    this.mobChat.setShowUnread(() => {
      this.unread_number = this.mobChat.getUnreadNumber();
    });
  }

  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;
    this.initChatRecord({START: ++this.start,otherUserid: this.otherParty}).auditTime(500).subscribe(data => {
      if (data.chatRecord.length > 0) {
        this.items = this.items.concat(data.chatRecord);
      } else {
        this.box_hd_isShow = false;
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    });
    this.globalData.showLoading = true;
  }
}
