import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage";
import {AlertController, App, NavController} from "ionic-angular";
import {MyApp} from "../app/app.component";

@Injectable()
export class GlobalData {
  get badgeNum(): number {
    return this._badgeNum;
  }

  set badgeNum(value: number) {
    this._badgeNum = value;
  }
  get nativeAudioBeep(): any {
    return this._nativeAudioBeep;
  }

  set nativeAudioBeep(value: any) {
    this._nativeAudioBeep = value;
  }
  get currentTrainingClass(): string {
    return this._currentTrainingClass;
  }

  set currentTrainingClass(value: string) {
    this._currentTrainingClass = value;
  }

  get myTrainingClass(): any {
    return this._myTrainingClass;
  }

  set myTrainingClass(value: any) {
    this._myTrainingClass = value;
  }

  get gaodeMap() {
    return this._gaodeMap;
  }

  set gaodeMap(value) {
    this._gaodeMap = value;
  }

  private _userId: string; //用户id
  private _username: string; //用户名
  private _useralias: string; //用户昵称
  private _user; //用户详细信息
  private _fileServer; //ftp地址
  private _llog001; //日志id
  private _secreKkey; //参数加密值
  private _gaodeMap; //初始化的高德地图
  private _token: string; //token
  private _myTrainingClass: any = {};//我的培训班集合
  private _currentTrainingClass: string;//已选中的培训班
  //设置http请求是否显示loading,注意:设置为true,接下来的请求会不显示loading,请求执行完成会自动设置为false
  private _showLoading: boolean = true;
  //是否启用文件缓存
  private _enabledFileCache: boolean = true;
  //系统提示音
  private _nativeAudioBeep: any;
  //系统徽章
  private _badgeNum: number;

  constructor(public storage: Storage,
              public appCtrl: App,
              private alertCtrl: AlertController,) {

  }

  //通过APP取NavController
  get navController(): NavController {
    return this.appCtrl.getRootNav();
  }

  get userId(): string {
    if (!this._userId) {
      this.storage.remove('token');
      this.alertCtrl.create({
        title: '密码已过期,请重新登录',
        buttons: [{
          text: '确定', handler: () => {
            this.appCtrl.goBack();
            this.navController.push('MyApp');
          }
        }],
        enableBackdropDismiss: false
      }).present();
      return '';
    }
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get user() {
    return this._user;
  }

  set user(value) {
    this._user = value;
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get showLoading(): boolean {
    return this._showLoading;
  }

  set showLoading(value: boolean) {
    this._showLoading = value;
  }

  get enabledFileCache(): boolean {
    return this._enabledFileCache;
  }

  set enabledFileCache(value: boolean) {
    this._enabledFileCache = value;
  }


  get fileServer() {
    return this._fileServer;
  }

  set fileServer(value) {
    this._fileServer = value;
  }

  get secreKkey() {
    return this._secreKkey;
  }

  set secreKkey(value) {
    this._secreKkey = value;
  }

  get useralias(): string {
    return this._useralias;
  }

  set useralias(value) {
    this._useralias = value;
  }

  set llog001(value) {
    this._llog001 = value;
  }

  get llog001() {
    return this._llog001;
  }
}
