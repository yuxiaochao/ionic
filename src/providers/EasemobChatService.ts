import {Injectable} from "@angular/core";
import {GlobalData} from "./GlobalData";
import {ChatMessage} from "../model/home/contact/chat-message/ChatMessage";
import {DomSanitizer} from "@angular/platform-browser";
import {Utils} from "./Utils";
import {NativeService} from "./NativeService";
import {File} from "@ionic-native/file";
import {AlertController, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {HttpService} from "./HttpService";
import {CommonService} from "../service/CommonService";

@Injectable()
export class EasemobChatService {
  get userFriendsConfig(): any {
    return this._userFriendsConfig;
  }

  set userFriendsConfig(value: any) {
    this._userFriendsConfig = value;
  }

  constructor(public globalData: GlobalData,
              private sanitizer: DomSanitizer,
              private nativeService: NativeService,
              private httpService: HttpService,
              public storage: Storage,
              private file: File,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              public commonService: CommonService,) {
  }

  reconnectionNum: number = 0;//重连次数
  /**
   * 掉线了
   */
  outOfLine: any;
  isMobile: boolean = false;//是否真机
  mobile: string = "";//设备标识   android   ios
  dataDirectory: string = "";//文件储存目录
  private _conn: any;//环信连接
  private _token: string;//环信登录token
  private _currentWindow: any = {
    isInside: false,//是否还在聊天窗里面
    userId: "",//自己userid
    to: "",//对方userid
    processingMsgMethod: msgContent => {
    }//处理消息方法
  };//正在聊天的窗口
  initializationSuccess: any;//初始化成功回调函数
  /******************** 处理写入历史消息队列 start *************************/
    //存放历史文件列表  {"otherParty_type":Array<(string)historyTxtName>}
  private _historyTxtsBean: any = {};
  private _writeHistoryTxts: Array<any> = [];//写入历史信息队列
  private _writeHistoryTxtRun: boolean = false;//是否正在写入
  /******************** 处理写入历史消息队列 end *************************/
  /******************** 处理写入用户聊天概况队列 start *************************/
  private _userChatProfile: any = [];//用户聊天概况
  private _writeUserChatProfiles: Array<any> = [];//写入用户聊天概况队列
  private _writeUserChatProfileRun: boolean = false;//是否正在写入
  /******************** 处理写入用户聊天概况队列 end *************************/
  /******************** 处理写入用户好友相关信息队列 start *************************/
    //用户好友相关信息，存放好友未读消息数
    //{"otherParty_type":{Unread_Number:(number)10,Unread_Shield:1屏蔽,Unread_Care:1特别关心}}
  private _userFriendsConfig: any = {};
  private _writeUserFriendsConfigs: Array<any> = [];//写入历史信息队列
  private _writeUserFriendsConfigRun: boolean = false;//是否正在写入
  /******************** 处理写入用户好友相关信息队列 end *************************/
  /******************** 这里判断离线信息是否读完 start *************************/
  private _timer01: any;//定时器01
  private _offlineInfo: Array<any> = [];//存放接收的离线信息
  private _offlineInfoIsFinishedReading: boolean = false;//离线信息是否已经读取完毕
  private _thePreviousTime: number = 0;//上一个msgid停留时间
  /******************** 这里判断离线信息是否读完 end *************************/


  get conn(): any {
    if (!this._conn) {//conn为空表示环信初始化失败，请重新登录
      this.alertCtrl.create({
        title: '网络不稳定！',
        subTitle: '当前网络太不稳定，为了不影响您的使用，请重新登录。',
        buttons: [
          {
            text: '确定',
            handler: () => {
              this.storage.remove("token");
              //下线
              this.downline();
            }
          }
        ]
      }).present();
    }
    return this._conn;
  }

  set conn(c) {
    this._conn = c;
  }

  get token(): string {
    return this._token;
  }

  set token(t) {
    this._token = t;
  }

  /**
   * 绑定显示消息方法
   */
  setCurrentWindow(obj: { isInside: boolean, userId: string, to: string, processingMsgMethod: any }) {
    this._currentWindow = {...obj};
  }


  /**
   * 绑定环信初始化成功方法
   */
  setInitializationSuccess(obj) {
    try {
      this.initializationSuccess = obj;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 解绑环信初始化成功方法
   */
  unsetInitializationSuccess() {
    this.initializationSuccess = () => {
    };
  }

  private showUnread = () => {
  };

  /**
   * 绑定显示未读消息方法
   */
  setShowUnread(obj) {
    try {
      this.showUnread = obj;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 解绑显示未读消息方法
   */
  unsetShowUnread() {
    this.showUnread = () => {
    };
  }

  //初始化环信
  instantiationConn() {
    let mobile = this.nativeService.getMobile();//判断是什么客户端   android     ios
    let isMobile = this.nativeService.isMobile();//判断是否真机
    if ((mobile == "android" || mobile == "ios") && isMobile) {//判断是否真机
      if (mobile == "android") {
        //在哪里放置应用程序特定的数据文件
        //let dataDirectory = this.file.dataDirectory;
        this.dataDirectory = this.file.dataDirectory;
      } else if (mobile == "ios") {
        //在哪里放置应用程序特定的数据文件
        this.dataDirectory = this.file.documentsDirectory;
      }
    }
    return new Promise((resolve, reject) => {
      //初始化UserFriendsConfig.txt文件
      this.initUserFriendsConfig().then(req => {
        /************ 初始化环信 start ************/
        if (!this._conn) {
          this._conn = new WebIM.connection({
            isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
            https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
            url: WebIM.config.xmppURL,
            heartBeatWait: WebIM.config.heartBeatWait,
            autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
            autoReconnectInterval: WebIM.config.autoReconnectInterval,
            apiUrl: WebIM.config.apiURL,
            isAutoLogin: true
          });
          this.easemobListen();
        }
        /************ 初始化环信 end ************/
        try {
          this.initializationSuccess();
        } catch (e) {
        }
        resolve(true);
      });
    });
  }

  // listern，添加回调函数
  private easemobListen() {
    // listern，添加回调函数
    this.conn.listen({
      onOpened: (message) => {          //连接成功回调，连接成功后才可以发送消息
        //如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用this.conn.setPresence(); 在本例中，conn初始化时已将isAutoLogin设置为true
        // 所以无需调用this.conn.setPresence();
        console.log("%c [opened] 连接已成功建立", "color: green")
      },
      onTextMessage: (message) => {  //收到文本消息
        // 在此接收和处理消息，根据message.type区分消息来源，私聊或群组或聊天室
        console.log(message);
        console.log(message.type);
        console.log('Text');
        let msgContentJson = message.data;//内容文本
        try {
          let msgContent: ChatMessage = JSON.parse(msgContentJson);
          //发送系统消息
          this.sendSystemMessage(msgContent);
        } catch (e) {
          console.log("JSON.parse(msgContentJson) err:" + e);
        }
      },
      onEmojiMessage: (message) => {   //收到表情消息
        // 当为WebIM添加了Emoji属性后，若发送的消息含WebIM.Emoji里特定的字符串，connection就会自动将
        // 这些字符串和其它文字按顺序组合成一个数组，每一个数组元素的结构为{type: 'emoji(或者txt)', data:''}
        // 当type='emoji'时，data表示表情图像的路径，当type='txt'时，data表示文本消息
        console.log(message);
        let data = message.data;
        let msgContent = "";//内容文本
        let who = "";//谁发来的消息
        for (let i = 0, l = data.length; i < l; i++) {
          console.log(data[i]);
          if (data[i].type == "txt") {
            msgContent += data[i].data;
          } else if (data[i].type == "emoji") {

          } else {
            msgContent += data[i].data;
          }
          who = data[i].from;
        }
        if (this._currentWindow && this._currentWindow.isInside && this._currentWindow.to == who) {
          //在聊天页面并且发来的消息的人和我聊天的是同一个
          this._currentWindow.processingMsgMethod(msgContent);
        } else {//不在聊天页面

        }
      },
      onPictureMessage: (message) => { //收到图片消息
        console.log('Picture');

        let options: any = {url: message.url};
        options.onFileDownloadComplete = () => {
          // 图片下载成功
          console.log('Image download complete!');
        };
        options.onFileDownloadError = () => {
          // 图片下载失败
          console.log('Image download failed!');
        };
        WebIM.utils.download.call(this.conn, options);       // 意义待查

      },
      onCmdMessage: (message) => {//收到命令消息
        console.log('CMD');
      },
      onAudioMessage: (message) => {//收到音频消息
        debugger
        var options = {
          url: message.url,
          onFileDownloadComplete:(response)=>{
            //音频下载成功，需要将response转换成blob，使用objectURL作为audio标签的src即可播放。
            let objectURL = WebIM.utils.parseDownloadResponse.call(this.conn, response);
            let msgContentJson :ChatMessage= {
              msgId:message.id,
              msg:response.size+'',
              type:'others',
              from:message.from,
              fromType:'chat',
              filepath:message.url,
              msgType:'audio',
            };//内容文本
            try {
              //发送系统消息
              this.sendSystemMessage(msgContentJson);
            } catch (e) {
              console.log("JSON.parse(msgContentJson) err:" + e);
            }
          },
          onFileDownloadError:()=>{
            //音频下载失败
            console.log('音频下载失败');
          },
          headers:{
            //通知服务器将音频转为mp3
            'Accept': 'audio/mp3'
          }
        };
        WebIM.utils.download.call(this.conn, options);
        console.log("Audio");
      },
      onLocationMessage: (message) => {//收到位置消息
        console.log("Location");
      },
      onFileMessage: (message) => {//收到文件消息
        console.log("File");
      },
      onVideoMessage: (message) => {//收到视频消息
        let node: any = document.getElementById('privateVideo');
        let option = {
          url: message.url,
          headers: {
            'Accept': 'audio/mp4'
          },
          onFileDownloadComplete: (response) => {
            // let objectURL = WebIM.utils.parseDownloadResponse.call(this.conn, response);
            node.src = WebIM.utils.parseDownloadResponse.call(this.conn, response);
          },
          onFileDownloadError: () => {
            console.log('File down load error.');
          }
        };
        WebIM.utils.download.call(this.conn, option);
      },
      onPresence: (message) => {
        switch (message.type) {
          case 'subscribe':                           // 对方请求添加好友
            // 同意对方添加好友
            document.getElementById('agreeFriends').onclick = (message) => {
              this.conn.subscribed({
                to: 'asdfghj',
                message: "[resp:true]"
              });
            };
            // 拒绝对方添加好友
            document.getElementById('rejectFriends').onclick = (message: any) => {
              this.conn.unsubscribed({
                to: message.from,
                message: "rejectAddFriend"                  // 拒绝添加好友回复信息
              });
            };

            break;
          case 'subscribed':                          // 对方同意添加好友，已方同意添加好友
            break;
          case 'unsubscribe':                         // 对方删除好友
            break;
          case 'unsubscribed':                        // 被拒绝添加好友，或被对方删除好友成功
            break;
          case 'memberJoinPublicGroupSuccess':                 // 成功加入聊天室
            console.log('join chat room success');
            break;
          case 'joinChatRoomFaild':                   // 加入聊天室失败
            console.log('join chat room faild');
            break;
          case 'joinPublicGroupSuccess':              // 意义待查
            console.log('join public group success', message.from);
            break;
          case 'createGroupACK':
            this.conn.createGroupAsync({
              from: message.from,
              success: (option) => {
                console.log('Create Group Succeed');
              }
            });
            break;
        }
      },
      onRoster: (message) => { //处理好友申请 //收到联系人订阅请求（加好友）、处理群组、聊天室被踢解散等消息
        console.log('Roster');
      },
      onInviteMessage: (message) => {
        console.log('Invite');
      },  //处理群组邀请
      onOnline: () => {//本机网络连接成功
        console.log('onLine');
        this.alertCtrl.create({
          title: 'onLine!!',
          subTitle: '网络连上了!',
          buttons: [{text: '确定'},
            // {
            //   text: '去开启',
            //   handler: () => {
            //
            //   }
            // }
          ]
        }).present();
      },
      onOffline: () => {//本机网络掉线
        console.log('offline');
        this.alertCtrl.create({
          title: 'offline!!',
          subTitle: '网络掉线了!!',
          buttons: [{text: '确定'},
            // {
            //   text: '去开启',
            //   handler: () => {
            //
            //   }
            // }
          ]
        }).present();
      },
      onError: (message) => {
        console.log('Error');
        console.log(message);

        if (message && message.type == 1) {
          console.warn('连接建立失败！请确认您的登录账号是否和appKey匹配。')
          let msgData = JSON.parse(message.data.data);
          if (msgData.error_description == "user not found" && !this.token) {//用户未找到
            this.signup(this.globalData.userId, this.globalData.useralias);//注册
          }
        } else if (message && message.type == 2) {//注册完走这个方法
          if (this.reconnectionNum < 3) {
            setTimeout(() => {
              this._token = null;
              this.login(this.globalData.userId, '123');
              this.reconnectionNum++;
            }, 2000);
          }
        } else if (message && message.type == 8) {
          //被挤下线了
          this.alertCtrl.create({
            title: '下线通知!',
            subTitle: "您的账号在别处登录了，如果不是您本人操作，请您尽快登录pc端修改密码！",
            buttons: [{
              text: '确定',
              handler: () => {
                this.storage.remove("token");
                //下线
                this.downline();
              }
            }
            ]
          }).present();
        }
      },           //失败回调
      onBlacklistUpdate: (list) => {
        // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
        console.log(list);
      }     // 黑名单变动
    });
  }

  /**
   * 发送系统消息
   */
  sendSystemMessage(msgContent: ChatMessage) {
    let who = msgContent.from;//谁发来的消息
    let beep;
    if (msgContent.type == 'others') {
      let tt = this._userFriendsConfig[who + '_chat'];//判断是聊天还是系统消息
      if(!tt){
        tt={};
        (this._userFriendsConfig[who + '_chat'])={};
      }
      if (tt['Unread_Shield'] && tt['Unread_Care']) {//判断是否掉过接口了
        if (tt['Unread_Shield'] == 1) {//TODO 是否屏蔽好友 1屏蔽
          return;
        } else if (tt['Unread_Care'] == 1) {//TODO 是否特别关心 1是
          beep=2;//给一个特备关心提示音
        }
      } else {
        this.globalData.showLoading=false;
        this.httpService.postFormData('/cts/queryFriendInfo', {
          USER001: this.globalData.userId,
          FRIENDID: msgContent.from
        }).subscribe(data => {
          this.globalData.showLoading=true;
          let friendInfo = data.friendInfo;
          (this._userFriendsConfig[who + '_chat'])['Unread_Shield'] = friendInfo.FRRS007;
          (this._userFriendsConfig[who + '_chat'])['Unread_Care'] = friendInfo.FRRS006;
        });
      }
    }

    msgContent.msg = this.sanitizer.bypassSecurityTrustHtml(
      msgContent.msg.changingThisBreaksApplicationSecurity
    );//把消息内容转换成html格式
    if (this._currentWindow && this._currentWindow.isInside && this._currentWindow.to == who) {
      //在聊天页面并且发来的消息的人和我聊天的是同一个
      this._currentWindow.processingMsgMethod(msgContent);
      this.writeHistoryTxt(msgContent, msgContent.from, msgContent.fromType);//把聊天信息写入历史文件
    } else {//不在聊天页面
      if (!this._timer01 && !this._offlineInfoIsFinishedReading) {
        this._timer01 = setInterval(() => {
          if (this._thePreviousTime >= 2000) {//上一个msgid已经停留超过2秒，可以认为离线消息已经读完，然后进行离线信息排序
            clearInterval(this._timer01);//停止定时器
            this._offlineInfoIsFinishedReading = true;//离线消息已经读完
            this.paixuOfflineInfo();//排序并处理数据
          }
          this._thePreviousTime += 100;
        }, 100);//定期检查
      }
      if (!this._offlineInfoIsFinishedReading) {
        this._thePreviousTime = 0;
        this._offlineInfo.push(msgContent);
      } else {
        //记录到未读信息和未读信息数
        this.writeUserFriendsConfig(msgContent.from, msgContent.fromType, "Unread_Number", "1").then(req => {
          //接收到信息提示方法
          this.messageReminding(msgContent,beep);
        }).catch(err => {
          console.error(err);
        });
        this.writeHistoryTxt(msgContent, msgContent.from, msgContent.fromType);//把聊天信息写入历史文件
      }
    }
  }

  /**
   * 排序this._offlineInfo,并把处理数据
   */
  paixuOfflineInfo() {
    if (this._offlineInfo.length >= 1) {
      //let infoR:Array<any> = this.quickSort(this._offlineInfo);//排序
      let infoR: Array<any> = this._offlineInfo;
      for (let info of infoR) {
        //记录到未读信息和未读信息数
        this.writeUserFriendsConfig(info["from"], info["fromType"], "Unread_Number", "1").then(req => {
          try {
            //调用未读消息响应方法
            this.showUnread();
          } catch (e) {
            console.error(e);
          }
        }).catch(err => {
          console.error(err);
        });
        this.writeHistoryTxt(info, info["from"], info["fromType"]);//把聊天信息写入历史文件
      }
    }
  }

  /**
   * 快速排序
   * @param {Array<any>} arr
   * @returns {any}
   */
  quickSort(arr: Array<any>) {
    //如果数组<=1,则直接返回
    if (arr && arr.length <= 1) {
      return arr;
    }
    try {
      let pivotIndex = Math.floor(arr.length / 2);
      //找基准，并把基准从原数组删除
      let pivot: any = arr.splice(pivotIndex, 1)[0];
      //定义左右数组
      let left: Array<any> = [];
      let right: Array<any> = [];

      //比基准小的放在left，比基准大的放在right
      for (let i = 0; i < arr.length; i++) {
        if (parseInt(arr[i]["msgId"]) <= parseInt(pivot["msgId"])) {
          left.push(arr[i]);
        }
        else {
          right.push(arr[i]);
        }
      }
      //递归
      return this.quickSort(left).concat([pivot], this.quickSort(right));
    } catch (e) {
      console.log(" quickSort err:" + e);
      return [];
    }
  }

  /**
   * 初始化用户好友相关信息
   */
  private initUserFriendsConfig(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let mobile = this.nativeService.getMobile();//判断是什么客户端   android     ios
      let isMobile = this.nativeService.isMobile();//判断是否真机
      if ((mobile == "android" || mobile == "ios") && isMobile) {//判断是否真机
        //检查目录中是否存在某个目录   路径“/userId”
        this.nativeService.createDirectoryMultiple(this.dataDirectory, this.globalData.userId).then(req => {
          if (req) {//存在目录
            this.file.resolveDirectoryUrl(this.dataDirectory + this.globalData.userId).then(req02 => {
              this.file.getFile(req02, "userFriendsConfig.txt", {create: true}).then(req03 => {
                req03.file(file => {
                  let reader = new FileReader();
                  reader.onloadend = (e2) => {
                    let userFriendsConfig: string = reader.result;
                    if (userFriendsConfig) {
                      try {
                        this._userFriendsConfig = JSON.parse(userFriendsConfig);
                      } catch (e) {
                        console.log("JSON.stringify(userFriendsConfig) err:" + e);
                      }
                    }
                  };
                  reader.readAsText(file, "utf-8");
                  /********************  记录用户聊天基本概况 start  *****************/
                  this.file.getFile(req02, "userChatProfile.txt", {create: true}).then(req04 => {
                    req04.file(file02 => {
                      let reader = new FileReader();
                      reader.onloadend = (e2) => {
                        let userChatProfile: string = reader.result;
                        if (userChatProfile) {
                          try {
                            this._userChatProfile = JSON.parse(userChatProfile);
                          } catch (e) {
                            console.log("JSON.stringify(userChatProfile) err:" + e);
                          }
                        }
                        resolve(true);
                      };
                      reader.readAsText(file02, "utf-8");
                    });
                  }).catch(() => {
                  });
                  /*******************  记录用户聊天基本概况 end  ******************/
                });
              });
            })
          }
        });
      } else {
        resolve(true);
      }
    });
  }

  /**
   * 把某對象所有信息置爲已讀
   */
  readMessageNum(otherParty: string, type: string) {
    let ufc: any = this._userFriendsConfig[otherParty + "_" + type];
    if (!ufc) ufc = {};
    ufc["Unread_Number"] = 0;
    this._userFriendsConfig[otherParty + "_" + type] = ufc;
    this.statisticsTotalUnreadNumber();
    return new Promise((resolve, reject) => {
      try {
        if (this._userChatProfile) {
          for (let thisUcp of this._userChatProfile) {
            if (thisUcp && thisUcp["userChatProfileId"] == otherParty + "_" + type) {
              this.writeUserChatProfile(thisUcp, "others", otherParty, type).then(req => {
                resolve(req);
              });
              break;
            }
          }
        } else {
          reject("readMessageNum err:this._userChatProfile is null!");
        }
      } catch (e) {
        reject("readMessageNum err:" + e);
      }
    });
  }

  /**
   * 统计总未读数
   */
  private statisticsTotalUnreadNumber() {
    /****************** 增加总未读数 start *****************/
    let unreadSum: number = 0;
    for (let ufc in this._userFriendsConfig) {
      if (ufc && typeof ufc == "string" && (ufc.indexOf("_chat") != -1 || ufc.indexOf("_group") != -1 || ufc.indexOf("_room") != -1)) {
        let nowUfc = this._userFriendsConfig[ufc];
        if (nowUfc) {
          let unreadNum: number = 0;
          try {
            unreadNum = parseInt(nowUfc["Unread_Number"]);
          } catch (e) {
          }
          unreadSum = unreadSum + unreadNum
        }
      }
    }
    this._userFriendsConfig["Total_Unread_Number"] = unreadSum;
    /****************** 增加总未读数 end *****************/
  }

  /**
   * 初始化历史数据
   */
  initHistoryData(otherParty: string, type: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let mobile = this.nativeService.getMobile();//判断是什么客户端   android     ios
      let isMobile = this.nativeService.isMobile();//判断是否真机
      if ((mobile == "android" || mobile == "ios") && isMobile) {//判断是否真机
        this.mobile = mobile;
        this.isMobile = isMobile;
        let historyTxts: Array<string> = [];//历史消息文件（名称）列表
        //检查目录中是否存在某个目录   路径“/userId/chat/聊天对象Id”
        this.nativeService.createDirectoryMultiple(this.dataDirectory, this.globalData.userId + "/" + type + "/" + otherParty).then(req => {
          if (req) {//存在目录
            /***************读取文件列表 start ********************/
            this.file.listDir(this.dataDirectory + this.globalData.userId + "/" + type + "/", otherParty).then(entrys => {
              for (let entry of entrys) {
                if (entry.isFile) {
                  historyTxts.push(entry.name);
                }
              }
              this._historyTxtsBean[otherParty + "_" + type] = historyTxts;
              /****************** 把該對象未讀信息設置為0 *****************/
              this.readMessageNum(otherParty, type).then(() => {
              });
              resolve(true);
            }).catch(err => {
            });
            /*****************读取文件列表 end ******************/
          }
        }).catch(err => {
        })
      } else {
        resolve(true);
      }
    });
  }


  /**
   *  写入历史记录文件
   *  @param msgObj
   *  @param otherParty   聊天对象id
   *  @param type chat单聊    group群组    room聊天室
   */
  writeHistoryTxt(msgObj: ChatMessage, otherParty: string, type: string, otherUser?: any) {
    let mobile = this.nativeService.getMobile();//判断是什么客户端   android     ios
    let isMobile = this.nativeService.isMobile();//判断是否真机
    if ((mobile == "android" || mobile == "ios") && isMobile) {//判断是否真机
      try {
        this._writeHistoryTxts.push({msgObj: msgObj, otherParty: otherParty, type: type});
        if (!this._writeHistoryTxtRun) {
          this._writeHistoryTxtRun = true;
          let nowMsgObj = this._writeHistoryTxts.shift();//先进先出
          this.writeHistoryTxtRun(nowMsgObj["msgObj"], nowMsgObj["otherParty"], nowMsgObj["type"]).then(req => {
            this._writeHistoryTxtRun = false;
          });
        }
        this.writeUserChatProfile(msgObj, msgObj["type"], otherParty, type, otherUser);//写入用户聊天概况
      } catch (e) {
        console.error(e);
      }
    }
  }

  writeHistoryTxtRun(msgObj: ChatMessage, otherParty: string, type: string) {
    return new Promise((resolve, reject) => {
      try {
        let date = Utils.dateFormat(new Date(), "yyyyMMdd");//当前日期
        let fileName: string = date + "_" + type + ".txt";//文件名称
        let msgJson = JSON.stringify(msgObj); //序列化
        this.nativeService.createDirectoryMultiple(this.dataDirectory, this.globalData.userId + "/" + type + "/" + otherParty).then(req => {
          this.file.resolveDirectoryUrl(this.dataDirectory + this.globalData.userId + "/" + type + "/" + otherParty)
            .then(req03 => {
              this.file.getFile(req03, fileName, {create: true}).then(req04 => {
                this.file.writeFile(this.dataDirectory + this.globalData.userId + "/" + type + "/" + otherParty, fileName, msgJson + "*#^^#*", {append: true}).then(req04 => {
                  if (this._writeHistoryTxts.length >= 1) {
                    let nowMsgObj = this._writeHistoryTxts.shift();//先进先出
                    this.writeHistoryTxtRun(nowMsgObj["msgObj"], nowMsgObj["otherParty"], nowMsgObj["type"]).then(req => {
                      resolve(req);
                    });
                  } else {
                    resolve(false);
                  }
                }).catch(err => {
                  reject(err.message);
                });
              });
            })
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 写入用户好友相关信息
   * @param {string} otherParty
   * @param {string} type
   * @param {string} key
   * @param {string} value
   * @returns {Promise<any>}
   */
  writeUserFriendsConfig(otherParty: string, type: string, key: string, value: string) {
    return new Promise((resolve, reject) => {
      let mobile = this.nativeService.getMobile();//判断是什么客户端   android     ios
      let isMobile = this.nativeService.isMobile();//判断是否真机
      if ((mobile == "android" || mobile == "ios") && isMobile) {//判断是否真机
        try {
          this._writeUserFriendsConfigs.push({otherParty: otherParty, type: type, key: key, value: value});
          if (!this._writeUserFriendsConfigRun) {
            this._writeUserFriendsConfigRun = true;
            let nowMsgObj = this._writeUserFriendsConfigs.shift();//先进先出
            this.writeUserFriendsConfigRun(nowMsgObj["otherParty"], nowMsgObj["type"], nowMsgObj["key"], nowMsgObj["value"]).then(req => {
              this._writeUserFriendsConfigRun = false;
            });
          }
          resolve(true);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(true);
      }
    });
  }

  /**
   * 写入用户好友相关信息
   * @param otherParty 其他对象id
   * @param type 对象类型   chat单聊    group群组    room聊天室
   * @param key
   * @param value
   */
  writeUserFriendsConfigRun(otherParty: string, type: string, key: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let configJson = "";
        switch (key) {
          case "Unread_Number"://增加未读数量
            /****************** 增加单个未读数 start *****************/
            let config02: any = this._userFriendsConfig[otherParty + "_" + type];
            if (!config02) {
              config02 = {};
            }
            let value02 = config02[key];
            if (value02) {
              config02[key] = parseInt(value02) + parseInt(value);
            } else {
              config02[key] = parseInt(value);
            }
            this._userFriendsConfig[otherParty + "_" + type] = config02;
            /****************** 增加单个未读数 end *****************/
            /****************** 统计总未读数 start *****************/
            this.statisticsTotalUnreadNumber();
            /****************** 统计总未读数 end *****************/
            configJson = JSON.stringify(this._userFriendsConfig);
            break;
          default:
            let config: any = {};
            config[key] = value;
            this._userFriendsConfig[otherParty + "_" + type] = config;
            configJson = JSON.stringify(this._userFriendsConfig);
        }
        this.nativeService.createDirectoryMultiple(this.dataDirectory, this.globalData.userId).then(req => {
          this.file.writeFile(this.dataDirectory + this.globalData.userId, "userFriendsConfig.txt", configJson, {replace: true}).then(req04 => {
            if (this._writeUserFriendsConfigs && this._writeUserFriendsConfigs.length >= 1) {
              let nowMsgObj = this._writeUserFriendsConfigs.shift();//先进先出
              this.writeUserFriendsConfigRun(nowMsgObj["otherParty"], nowMsgObj["type"], nowMsgObj["key"], nowMsgObj["value"]).then(req => {
                resolve(req);
              });
            } else {
              resolve(true);
            }
          });
        });
      } catch (e) {
        reject("writeUserFriendsConfigRun err:" + e);
      }
    });
  }

  /**
   * 写入用户聊天概况
   * @param msgObj 消息
   * @param isMy 该消息是否我发的  me   others
   * @param otherParty 对象id
   * @param type 聊天类型
   */
  writeUserChatProfile(msgObj: ChatMessage, isMy: string, otherParty: string, type: string, otherUser?: any) {
    if (!otherUser) {
      otherUser = {};
    }
    return new Promise((resolve, reject) => {
      // let mobile = this.nativeService.getMobile();//判断是什么客户端   android     ios
      // let isMobile = this.nativeService.isMobile();//判断是否真机
      // if ((mobile == "android" || mobile == "ios") && isMobile) {//判断是否真机
      try {
        if (this._userChatProfile) {
          let isMatcher = false;
          for (let i = 0; i < this._userChatProfile.length; i++) {
            let ucpObj: any = this._userChatProfile[i];
            if (ucpObj && ucpObj["userChatProfileId"] && ucpObj["userChatProfileId"] == otherParty + "_" + type) {
              if (isMy == "top") {//消息置顶
                this._userChatProfile.unshift(this._userChatProfile.remove(i));//把排序放到第一位
              } else if (isMy == "me") {//自己发的信息
                this._userChatProfile[i] = {
                  ...ucpObj,
                  ...msgObj,
                  from: otherUser.USER001,
                  fromName: otherUser.USER005,
                  sex: otherUser.USER006,
                  portrait: otherUser.ATTA007,
                  unreadNum: 0,
                  msg: this.sanitizer.bypassSecurityTrustHtml(msgObj["msg"]["changingThisBreaksApplicationSecurity"])
                };//把消息内容转换成html格式
                this._userChatProfile.unshift(this._userChatProfile.remove(i));//把排序放到第一位
              } else {//别人发的信息
                this._userChatProfile[i] = {
                  ...ucpObj,
                  ...msgObj,
                  unreadNum: this.getUnreadNumber(otherParty, type),
                  msg: this.sanitizer.bypassSecurityTrustHtml(msgObj["msg"]["changingThisBreaksApplicationSecurity"])
                };
              }
              isMatcher = true;
              break;
            }
          }
          if (!isMatcher) {//不存在该好友的消息
            if (isMy == "me") {//自己发的信息
              let ucpObj = {
                ...msgObj,
                from: otherUser.USER001,
                fromName: otherUser.USER005,
                sex: otherUser.USER006,
                portrait: otherUser.ATTA007,
                unreadNum: 0,
                userChatProfileId: otherParty + "_" + type,
                msg: this.sanitizer.bypassSecurityTrustHtml(msgObj["msg"]["changingThisBreaksApplicationSecurity"])
              };
              this._userChatProfile.unshift(ucpObj);//加到头部
            } else {
              let ucpObj = {
                ...msgObj,
                userChatProfileId: otherParty + "_" + type,
                unreadNum: this.getUnreadNumber(otherParty, type),
                msg: this.sanitizer.bypassSecurityTrustHtml(msgObj["msg"]["changingThisBreaksApplicationSecurity"])
              };
              this._userChatProfile.unshift(ucpObj);//加到头部
            }
          }

          this._writeUserChatProfiles.push(JSON.stringify(this._userChatProfile));
          if (!this._writeUserChatProfileRun) {
            this._writeUserChatProfileRun = true;
            let nowMsg = this._writeUserChatProfiles.shift();//先进先出
            this.writeUserChatProfileRun(nowMsg).then(req => {
              this._writeUserChatProfileRun = false;
            });
          }
        }
        resolve(true);
      } catch (e) {
        console.log(" writeUserChatProfile err:" + e);
        reject(" writeUserChatProfile err:" + e);
      }
      // }
    });
  }

  /**
   * 写入用户聊天概况Run   _userChatProfile
   */
  writeUserChatProfileRun(configJson: string) {
    return new Promise((resolve, reject) => {
      let mobile = this.nativeService.getMobile();//判断是什么客户端   android     ios
      let isMobile = this.nativeService.isMobile();//判断是否真机
      if ((mobile == "android" || mobile == "ios") && isMobile) {//判断是否真机
        try {
          this.nativeService.createDirectoryMultiple(this.dataDirectory, this.globalData.userId).then(req => {
            this.file.writeFile(this.dataDirectory + this.globalData.userId, "userChatProfile.txt", configJson, {replace: true}).then(req04 => {
              if (this._writeUserChatProfiles && this._writeUserChatProfiles.length >= 1) {
                let configJsonNext = this._writeUserChatProfiles.shift();//先进先出
                this.writeUserChatProfileRun(configJsonNext).then(req => {
                  resolve(req);
                });
              } else {
                resolve(true);
              }
            });
          });
        } catch (e) {
          reject("writeUserChatProfileRun err:" + e);
        }
      } else {
        resolve(true);
      }
    });
  }

  /**
   * 读取聊天概况列表
   */
  readUserChatProfile() {
    if (this._userChatProfile) {
      return this._userChatProfile;
    }
  }

  /**
   * 置頂消息
   */
  setTop(otherParty: string, type: string) {
    return new Promise((resolve, reject) => {
      try {
        if (this._userChatProfile) {
          for (let thisUcp of this._userChatProfile) {
            if (thisUcp && thisUcp["userChatProfileId"] == otherParty + "_" + type) {
              this.writeUserChatProfile(thisUcp, "top", otherParty, type).then(req => {
                resolve(req);
              });
              break;
            }
          }
        } else {
          reject("setTop err:this._userChatProfile is null!");
        }
      } catch (e) {
        reject("setTop err:" + e);
      }
    });
  }

  /**
   * 刪除聊天
   */
  removeUserChatProfile(otherParty: string, type: string) {
    return new Promise((resolve, reject) => {
      try {
        if (this._userChatProfile) {
          for (let i = 0; i < this._userChatProfile.length; i++) {
            let thisUcp = this._userChatProfile[i];
            if (thisUcp && thisUcp["userChatProfileId"] == otherParty + "_" + type) {
              this._userChatProfile.remove(i);
              break;
            }
          }
          //把未讀的消息置爲已讀
          this.readMessageNum(otherParty, type).then(() => {
          });
          resolve(true);
        } else {
          reject("removeUserChatProfile err:this._userChatProfile is null!");
        }
      } catch (e) {
        reject("removeUserChatProfile err:" + e);
      }
    });
  }

  /**
   * 读取聊天历史记录文件
   * @param {Array<ChatMessage>} historyItems
   * @param {string} otherParty
   * @param {string} type
   * @returns {Promise<boolean>}
   */
  readHistoryTxt(historyItems: Array<ChatMessage>, otherParty: string, type: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        let historyTxts = this._historyTxtsBean[otherParty + "_" + type];
        if (historyTxts && historyTxts.length >= 1) {
          let thisHistoryTxt = historyTxts.shift();//文件名称
          this.file.resolveDirectoryUrl(this.dataDirectory + this.globalData.userId + "/" + type + "/" + otherParty)
            .then(req03 => {
              this.file.getFile(req03, thisHistoryTxt, {create: true}).then(req04 => {
                req04.file(file => {
                  let reader = new FileReader();
                  reader.onloadend = (e2) => {
                    let historyContent = reader.result;
                    if (historyContent) {
                      let hs = historyContent.split("*#^^#*");
                      let i = 0;
                      //如果数组最后一个是空值，把最后一个删除掉
                      if (!hs[hs.length - 1]) hs.pop();
                      //如果数组第一个是空值，第一个删除掉
                      if (!hs[0]) hs.shift();
                      for (let h of hs) {
                        try {
                          if (!h) {
                            i++;
                            continue
                          }
                          let hObj: ChatMessage = JSON.parse(h);
                          hObj.msg = this.sanitizer.bypassSecurityTrustHtml(hObj.msg.changingThisBreaksApplicationSecurity);//把消息内容转换成html格式
                          //判断是否当天第一条数据
                          if (i == 0) hObj.theFirst = true;
                          //判断是否当天最后一条数据
                          if (i == hs.length - 1) hObj.theLast = true;
                          historyItems.push(hObj);//读取文件，把聊天历史记录放到historyItems中
                        } catch (e) {
                        }
                        i++;
                      }
                    }
                    resolve(true);
                  };
                  reader.readAsText(file, "utf-8");
                });
              }).catch(err => {
                reject(err.message);
              });
            }).catch(err => {
            reject(err.message);
          })
        } else {
          resolve(false);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * 获得未读用户未读消息数
   */
  getUnreadNumber(otherParty?: string, type?: string): number {
    if (this._userFriendsConfig) {
      let unreadSum: number = 0;
      try {
        if (otherParty && type) {
          //单个人的未读数
          unreadSum = this._userFriendsConfig[otherParty + "_" + type]["Unread_Number"];
        } else {
          //总的未读数
          unreadSum = this._userFriendsConfig["Total_Unread_Number"];
        }
      } catch (e) {
        console.error(e);
      }
      return unreadSum;
    } else {
      return 0;
    }
  }

  //下线方法
  downline() {
    this._conn = null;
    this._token = null;
    this._historyTxtsBean = null;
    this._userChatProfile = null;
    this._userFriendsConfig = null;

    try {
      this.outOfLine();
    } catch (e) {
    }
  }

  /**
   * 接收到信息提示方法
   * @param msgContent 消息
   * @param beep 提示音类型 0 系统  1 默认  2 特别关心
   */
  messageReminding(msgContent: ChatMessage,beep?:number) {
    let msg = msgContent.fromName + ":";
    let content = msgContent.msg.changingThisBreaksApplicationSecurity;
    if (content && content.length > 20) {
      content = content.substring(0, 20);
      msg += content + "...";
    } else {
      msg += content;
    }
    let isActive = this.nativeService.isBackgroundActive();
    if (isActive) {//判断程序是否在后台
      this.nativeService.notice(msgContent.fromName, content, {});//通知栏提示信息
    } else {
      //小弹窗提示
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
    this.nativeService.vibrate(500);//震动0.5秒
    this.nativeService.preloadSimple(beep);//提示音
    try {
      //调用未读消息响应方法
      this.showUnread();
    } catch (e) {
      console.error(e);
    }
  }

  //登录
  login(username: string, password: string) {
    let options: any = {
      apiUrl: WebIM.config.apiURL,
      user: username,
      appKey: WebIM.config.appkey,
      success: (token2) => {
        let token = token2.access_token;
        this._token = token;
        console.log(' success! token：' + token);
      },
      error: () => {
        console.log('login error! token:' + this.token);
        if (this.token) {
          this._token = null;
          this.login(username, password);
        }
      }
    };
    if (this.token) {
      options.accessToken = this.token;
    } else {
      options.pwd = password;
    }
    this.conn.open(options);
  }

//注册
  signup(username: string, nickname: string) {
    let option = {
      username: username,
      password: '123',
      nickname: nickname,
      appKey: WebIM.config.appkey,
      success: (token) => {
        this._token = token;
        console.log('regist success! token：' + token);
        this.login(username, "123");//登录
      },
      error: function (e) {
        console.log('regist error:' + e);
        //TODO 注册用户失败，应弹窗提示重新登录或联系管理员
      },
      apiUrl: WebIM.config.apiURL
    };
    this.conn.signup(option);
  }

  /**
   * 发送消息
   * @param msgContent 消息内容
   * @param to 发给谁
   */
  sendPrivateText(msgContent: ChatMessage, to: string) {
    debugger
    let id = this.conn.getUniqueId();
    let msg = new WebIM.message(msgContent.msgType, id);
    let option: any = {};
    if(!msgContent.msgType) msgContent.msgType='txt';
    if(msgContent.msgType=='txt') {
      let type: string = msgContent.type == 'me' ? 'others' : msgContent.type;
      let msgConJson = JSON.stringify({...msgContent, type: type});
      option = {
        msg: msgConJson,                       // 消息内容
        to: to,                          // 接收消息对象
        roomType: false,
        success: (id, serverMsgId) => {
          console.log("send private text Success");
          if (msgContent.fromType == "chat" && msgContent.type == "me") {
            //保存信息到web
            this.saveInformationToWeb('3', msgContent, to);
          } else if (msgContent.fromType == "group" && msgContent.type == "me") {
            //保存信息到web
            this.saveInformationToWeb('2', msgContent, to);
          } else if (msgContent.fromType == "room" && msgContent.type == "me") {
            //保存信息到web
            this.saveInformationToWeb('2', msgContent, to);
          } else if (msgContent.type == "system") {
            //保存信息到web
            this.saveInformationToWeb('1', msgContent, to);
          } else if (msgContent.type == "newFriend") {
            //保存信息到web
            this.saveInformationToWeb('4', msgContent, to);
          } else if (msgContent.type == "dangjianban") {
            //保存信息到web
            this.saveInformationToWeb('5', msgContent, to);
          }
        },
        fail: () => {
          console.log("send private text Fail");
        }
      };
      if (msgContent.fromType == "group") {
        option["roomType"] = false;
        option["chatType"] = "chatRoom";
      } else if (msgContent.fromType == "room") {
        option["roomType"] = true;
        option["chatType"] = "chatRoom";
      }
      msg.set(option);
      if (msgContent.fromType == "group" || msgContent.fromType == "room") {
        msg.setGroup('groupchat');
      } else {
        msg.body.chatType = 'singleChat';
      }
      this.conn.send(msg.body);
    }else if(msgContent.msgType=='audio'){
      this.file.resolveDirectoryUrl(this.dataDirectory+this.globalData.userId+"/mediaFile/").then(req02 => {
        this.file.getFile(req02, msgContent.filepath, {create: true}).then(req03 => {
          req03.file(file => {
            // let reader = new FileReader();
            // reader.readAsArrayBuffer(file);
            //reader.onloadend = (e2) => {
            //let fileResult = reader.result;
            debugger
            if (file) {
              try {
                var allowType = {
                  'audio/mpeg': true,
                  'amr': true,
                  'wmv': true
                };
                if (file.type in allowType) {
                  option = {
                    apiUrl: WebIM.config.apiURL,
                    file: file,
                    to: to,                               // 接收消息对象
                    roomType: false,
                    chatType: 'singleChat',
                    onFileUploadError: function () {      // 消息上传失败
                      console.log('语音文件上传失败');
                    },
                    onFileUploadComplete: function () {   // 消息上传成功
                      console.log('语音文件上传成功');
                    },
                    success: function () {                // 消息发送成功
                      console.log('语音文件上传发送成功');
                    },
                    flashUpload: WebIM.flashUpload
                  };
                  if (msgContent.fromType == "group") {
                    option["roomType"] = false;
                    option["chatType"] = "chatRoom";
                  } else if (msgContent.fromType == "room") {
                    option["roomType"] = true;
                    option["chatType"] = "chatRoom";
                  }
                  msg.set(option);
                  if (msgContent.fromType == "group" || msgContent.fromType == "room") {
                    msg.setGroup('groupchat');
                  } else {
                    msg.body.chatType = 'singleChat';
                  }
                  this.conn.send(msg.body);
                }else {
                  //TODO 错误弹框
                }
              } catch (e) {
                console.log("JSON.stringify(fileResult) err:" + e);
              }
            }
            //};
          });
        });
      });
    }else {

    }
  }


  /**
   * 保存信息到web
   */
  saveInformationToWeb(CHME002, msgContent: ChatMessage, to: string) {
    this.globalData.showLoading = false;
    this.httpService.postFormData('/cts/saveTheMessage', {
      'CHME002': CHME002,
      'CHME003': this.globalData.userId,
      'CHME004': this.globalData.userId,
      'CHME006': to,
      'CHME007': to,
      'CHME008': msgContent.msg.changingThisBreaksApplicationSecurity
    }).subscribe(data => {
      if (!data) {
        console.log("发送消息失败！！！");
      }
    });
    this.globalData.showLoading = true;
  }

}
