import {Injectable} from "@angular/core";
import {NativeService} from "./NativeService";
import * as fundebug from "fundebug-javascript";
import {GlobalData,} from "./GlobalData";
import {Utils} from "./Utils";
import {Observable} from 'rxjs';
import {DEFAULT_AVATAR} from './Constants';
import {FileObj} from '../model/FileObj'
import {FileService} from "./FileService";
import {EasemobChatService} from "./EasemobChatService";
import {HttpService} from "./HttpService";
import {ChatMessage} from "../model/home/contact/chat-message/ChatMessage";
import {ScheduleRemindService} from "./ScheduleRemindService";
import {App, NavController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {NativeAudio} from "@ionic-native/native-audio";

declare var AlloyLever;

@Injectable()
export class Helper {

  constructor(private nativeService: NativeService,
              private globalData: GlobalData,
              private storage: Storage,
              private httpService : HttpService,
              private easemobChatService: EasemobChatService,
              private fileService: FileService,
              public appCtrl: App,
              private nativeAudio: NativeAudio,) {
  }

  /**
   * 设置日志监控app的版本号
   */
  funDebugInit() {
    if (this.nativeService.isMobile()) {
      this.nativeService.getVersionNumber().subscribe(version => {
        fundebug.appversion = version;
      })
    }
  }

  /**
   * AlloyLever,一款本地"开发者工具"
   * 文档:https://github.com/AlloyTeam/AlloyLever
   */
  alloyLeverInit() {
    AlloyLever.config({
      cdn: 'http://s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js',  //vconsole的CDN地址
      /*reportUrl: "//a.qq.com",  //错误上报地址
      reportPrefix: 'qun',    //错误上报msg前缀，一般用于标识业务类型
      reportKey: 'msg',        //错误上报msg前缀的key，用户上报系统接收存储msg
      otherReport: {              //需要上报的其他信息
        uin: 491862102
      },*/
      entry: "#entry"         //请点击这个DOM元素6次召唤vConsole。//你可以通过AlloyLever.entry('#entry2')设置多个机关入口召唤神龙
    })
  }

  /**
   * 登录成功处理
   */
  loginSuccessHandle(userInfo) {
    Utils.sessionStorageClear();//清除数据缓存
    this.globalData.user = userInfo;
    this.globalData.userId = userInfo.USER001;
    if(this.globalData.userId){
      this.globalData.username = userInfo.USER004;
      this.globalData.useralias = userInfo.USER005;
      this.globalData.fileServer = userInfo.sysConfig.fileServer;
      this.globalData.secreKkey = userInfo.sysConfig.secreKkey;
      this.globalData.llog001 = userInfo.llog001;
      this.globalData.myTrainingClass = userInfo.myTrainingClass;
      if(userInfo.myTrainingClass){
        this.globalData.currentTrainingClass = userInfo.myTrainingClass[0];//培训班默认取第一个
      }
    }
    //初始化环信
    this.easemobChatService.instantiationConn().then(req => {
      //环信登录   用userid登录
      this.easemobChatService.login(this.globalData.userId, "123");
    });
    //初始化系统信息
    this.loadSystemMessage();

    //初始化提示音
    this.initBeep();
    //初始化日程提醒队列
    //this.scheduleRemindService.getScheduleRemindList(userInfo.USER001);
  }

  //初始化提示音
  initBeep(){
    //默认提示音
    this.nativeAudio.preloadSimple('defaultBeep', 'assets/mp3/defaultBeep.mp3').then(
      (e) => {},
      (e) => {console.log('默认提示音初始化失败' + e);}
    );
    //系统提示音
    this.nativeAudio.preloadSimple('systemBeep', 'assets/mp3/systemBeep.mp3').then(
      (e) => {},
      (e) => {console.log('系统提示音初始化失败' + e);}
    );
    //特别关心提示音
    this.nativeAudio.preloadSimple('veryConcernedBeep', 'assets/mp3/veryConcernedBeep.mp3').then(
      (e) => {},
      (e) => {console.log('特别关心提示音初始化失败' + e);}
    );
    this.globalData.nativeAudioBeep = this.nativeAudio;
  }

  /**
   * 初始化系统信息
   */
  loadSystemMessage(){

    //查询系统信息，如果没有系统信息自动发送一条问候系统信息
    this.httpService.postFormData("/cts/systemMessagesList",{USER001:this.globalData.userId,START:1,LIMIT:1}).subscribe(data=>{
      if (!data.systemMessagesList || data.systemMessagesList.length == 0) {
        //没有系统消息
        this.httpService.postFormData("/cts/saveTheMessage",{
          USER001:this.globalData.userId,
          CHME002:1,CHME003:'24c87890d28e42d08766474b304ada0a',
          CHME006:this.globalData.userId,CHME008:'欢迎使用本系统！',CHME009:'0',CHME010:'',
          CHME011:'欢迎使用本系统！'}).subscribe(data=>{
          //检查是否有系统信息，若没有信息当作第一次使用该系统，自动发送一条问好系统消息给自己
          let hm: string = Utils.dateFormat(new Date(), "HH:mm");
          let date: string = Utils.dateFormat(new Date(), "MM-dd");
          let msgContent: ChatMessage = {msgId:new Date().getTime().toString(),
            msg:{changingThisBreaksApplicationSecurity:'欢迎使用本系统！'},
            sendingTime:hm,sendingDate:date,portrait:'system',
            type:'system',from:'system',fromName:'系统消息',fromType:'chat'};
          this.easemobChatService.sendSystemMessage(msgContent);
        });
      }else{
        //查看有没有历史文件
        let data = this.easemobChatService.readUserChatProfile();
        if(!data || data.length == 0){
          //检查是否有系统信息，若没有信息当作第一次使用该系统，自动发送一条问好系统消息给自己
          let hm: string = Utils.dateFormat(new Date(), "HH:mm");
          let date: string = Utils.dateFormat(new Date(), "MM-dd");
          let msgContent: ChatMessage = {msgId:new Date().getTime().toString(),
            msg:{changingThisBreaksApplicationSecurity:'欢迎使用本系统！'},
            sendingTime:hm,sendingDate:date,portrait:'system',
            type:'system',from:'system',fromName:'系统消息',fromType:'chat'};
          this.easemobChatService.sendSystemMessage(msgContent);
        }
      }
    });
  }

  /**
   * 掉线了
   * @param obj
   */
  outOfLine(obj){
    this.easemobChatService.outOfLine = obj;
  }

  /**
   * 退出登录
   */
  tuichudenglu(){
    let conn = this.easemobChatService.conn;
    conn.close();
    this.easemobChatService.conn = null;
    this.easemobChatService.token = null;
    this.storage.remove("token");
    let activeNav: NavController = this.appCtrl.getActiveNavs()[0];
    if (activeNav){
      activeNav.goToRoot({});
      this.appCtrl.getRootNav().setRoot('LoginPage');
    }
  }

  /**
   * 获取用户头像路径
   * @param avatarIdfileServer
   */
  loadAvatarPath(avatarId) {
    return Observable.create(observer => {
      if (!avatarId) {
        observer.next(DEFAULT_AVATAR);
      } else {
        this.fileService.getFileInfoById(avatarId).subscribe((res: FileObj) => {
          if (res.origPath) {
            let avatarPath = res.origPath;
            observer.next(avatarPath);
          } else {
            observer.next(DEFAULT_AVATAR);
          }
        }, () => {
          observer.next(DEFAULT_AVATAR);
        })
      }
    });
  }


}
