import { NgModule, ErrorHandler,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, Config } from 'ionic-angular';
import {IonicStorageModule} from "@ionic/storage";
import { MyApp } from './app.component';
import { FUNDEBUG_API_KEY } from '../providers/Constants';
import { FileOpener } from '@ionic-native/file-opener';
import { QRCodeModule } from 'angular2-qrcode';
import { Content } from 'ionic-angular';
import * as fundebug from 'fundebug-javascript';
import {IS_DEBUG} from "../providers/Constants";
import {HTTP} from '@ionic-native/http';
import { NativeService } from "../providers/NativeService";
import {HttpService} from "../providers/HttpService";
import {AppVersion} from "@ionic-native/app-version";
import {Camera} from "@ionic-native/camera";
import {Toast} from "@ionic-native/toast";
import {File} from "@ionic-native/file";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ImagePicker} from "@ionic-native/image-picker";
import {Network} from "@ionic-native/network";
import {AppMinimize} from "@ionic-native/app-minimize";
import {CallNumber} from "@ionic-native/call-number";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Logger} from "../providers/Logger";
import {GlobalData} from "../providers/GlobalData";
import {Diagnostic} from "@ionic-native/diagnostic";
import {CodePush} from "@ionic-native/code-push";
import {Helper} from "../providers/Helper";
import { QRScanner } from '@ionic-native/qr-scanner';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HttpClientModule} from "@angular/common/http";
import {
  ModalFromRightEnter, ModalFromRightLeave, ModalScaleEnter,
  ModalScaleLeave
} from "./modal-transitions";
import { FileTransfer, FileTransferObject }from'@ionic-native/file-transfer';

import {FileService} from "../providers/FileService";
import {Utils} from "../providers/Utils";
import {CommonService} from "../service/CommonService";
import {EasemobChatService} from "../providers/EasemobChatService";
import {TouchPunchProvider} from "./touchPunch";
import {UploadFileService} from "../providers/UploadFileService";
import {NoticeService} from "../providers/NoticeService";
import {SqliteService} from "../providers/SqliteService";
import {SQLite} from "@ionic-native/sqlite";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Vibration } from '@ionic-native/vibration';
import { NativeAudio } from '@ionic-native/native-audio';


fundebug.apikey = FUNDEBUG_API_KEY;
fundebug.releasestage = IS_DEBUG ? 'development' : 'production';//应用开发阶段，development:开发;production:生产
fundebug.silent = !IS_DEBUG;//如果暂时不需要使用Fundebug，将silent属性设为true


// 定义FundebugErrorHandler
export class FundebugErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    console.log(err);
    fundebug.notifyError(err);
  }
}


import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import {BackButtonProvider} from "../providers/BackButtonProvider";
import {ScheduleRemindService} from "../providers/ScheduleRemindService";
import {Media} from "_@ionic-native_media@4.18.0@@ionic-native/media";

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    // override hammerjs default configuration
    'pan': {threshold: 5},
    'swipe': {
      velocity: 0.4,
      threshold: 20,
      direction: 31
    },
    'press':{}
  }
}

// 将IonicErrorHandler替换为FundebugErrorHandler
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    QRCodeModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',//android是'md'
      backButtonText: '',
      tabsHideOnSubPages: true,
      backButtonIcon:'arrow-round-back'
      /*preloadModules: true*/
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    {provide: LOCALE_ID, useValue: "zh-CN"},
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    StatusBar,
    SplashScreen,
    AppVersion,
    Camera,
    Toast,
    File,
    InAppBrowser,
    ImagePicker,
    Network,
    AppMinimize,
    Diagnostic,
    HTTP,
    CodePush,
    CallNumber,
    BarcodeScanner,
    QRScanner,
    QRCodeModule,
    FileTransferObject,
    FileOpener,
    Content ,
    FileTransfer,
    {provide: ErrorHandler, useClass: FundebugErrorHandler},
    NativeService,
    HttpService,
    FileService,
    Helper,
    Utils,
    GlobalData,
    Logger,
    CommonService,
    EasemobChatService,
    TouchPunchProvider,
    UploadFileService,
    NoticeService,
    SqliteService,
    SQLite,
    LocalNotifications,
    Vibration,
    NativeAudio,
    BackButtonProvider,
    ScheduleRemindService,
    Media
  ]
})
export class AppModule {
  constructor(public config : Config){
    this.setCustomTransitions();
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
    this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
  }
}
