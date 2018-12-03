///<reference path="../../../../model/home/online-study/online-study-main/OneselfCourseLearnInfo.ts"/>
import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ImplementFun} from "../../../../model/home/online-study/online-study-main/ImplementFun";
import {CommonService} from "../../../../service/CommonService";
import {GlobalData} from "../../../../providers/GlobalData";
import {Storage} from "@ionic/storage";
import {OneselfCourseLearnInfo} from "../../../../model/home/online-study/online-study-main/OneselfCourseLearnInfo";
import {HttpService} from "../../../../providers/HttpService";

/**
 * Generated class for the OnlineStudyMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-online-study-main',
  templateUrl: 'online-study-main.html',
})
export class OnlineStudyMainPage {
  //detailsTabHeight = 0;
  detailsBodyHeight = 0;
  tipsSectionHeight = 0;
  detailsUlLiCur = 1;
  isConditionsOfCompletion = 1;
  implementFun: Array<ImplementFun> = [];//执行方法集
  catalogItems: any = [];//目录列表
  catalogStart: number = 1;//目录当前页
  catalogUnRecord: boolean = false;//
  evaluateItems: any = [];//评论列表
  evaluateStart: number = 1;//评论当前页
  evaluateUnRecord: boolean = false;//
  materialItems: any = [];//资料列表
  materialStart: number = 1;//资料当前页
  //materialUnRecord: boolean = false;//
  ftpServer = "";//ftp地址
  isCwCacheComplete = false;//缓存初始完毕
  timesNumMap: any = [];//课程信息-选课人数/好评数
  completionMap: any = [];//结业方式
  evaluationNumMapItem: any = [];//评论统计
  cur:number=-1;
  courseInfoMapItems:any=[];//课程预览-课程详情
  speakerListItems:any=[];//主讲人信息

  /********************  课件关键参数 start ******************************/
  curriculumType: number = 1;//课程类型  1 视频   2 文档
  leac001 = "";//学习课程id
  _nowCwItem: any = {};//当前播放课件集合
  _currentCoursewareId = "";//当前播放课件id
  _isPlay: boolean = false;//是否在播放课件
  _timer01: any;//计时器01
  _cwPageNum: number;//文档类型课件，文档总页数
  _cwNowPageIndex: number;//文档课件当前页下标
  schedule: string = '';//播放比例
  lecw009: string = '';//视频类课件首次学习时不允许拖拽：0、否 1、是
  /********************  课件关键参数 end ******************************/

  @ViewChild('video1') video1: ElementRef;
  //@ViewChild('text1') text1: ElementRef;
  @ViewChild('tipsSection') tipsSection: ElementRef;
  @ViewChild('coursewareDiv') coursewareDiv: ElementRef;
  @ViewChild('detailsTab') detailsTab: ElementRef;
  //@ViewChild('addContent') addContent:ElementRef;
  @ViewChild('headerEle', {read: ElementRef}) headerEle: ElementRef;

  constructor(public el: ElementRef,
              public navCtrl: NavController,
              public navParams: NavParams,
              public renderer: Renderer2,
              public commonService: CommonService,
              public globalData: GlobalData,
              public storage: Storage,
              private httpService: HttpService,
  ) {
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.ftpServer = this.globalData.fileServer;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');

    this.leac001 = this.navParams.get("leac001");
    this.implementFun.push({functionName: "initTimer", synchronization: false });//初始化每秒计时器
    this.implementFun.push({functionName: "initCache"});//初始化缓存
    this.implementFun.push({functionName: "initPageHeight"});//初始化高度
    this.implementFun.push({functionName: "initCatalogData"});//初始课件列表数据
    this.implementFun.push({functionName: "initCourseware"});//播放课件
    this.implementFun.push({functionName: "initEvaluateData"});//初始化评论列表数据
    this.implementFun.push({functionName: "initTimesAndPraiseNumData"});//初始化播放次数
    this.implementFun.push({functionName: "initGraduationConditionData"});//初始化课程信息-结业条件
    this.implementFun.push({functionName: "initCourseEvaluationData"});//初始化课程预览-评论数目(全部 好评 中评 差评)
    this.implementFun.push({functionName: "initCourseInfoData"});//初始化课程预览-课程详情
    this.runImplementFun();//开始执行加载方法

  }

  //离开页面事件
  ionViewWillLeave() {
    console.log("ionViewWillLeave()");
    this.leaveCache();
  }


  /**********************  视频播放器的js start ***********************/
  //重新加载
  loadplay() {
    this.video1.nativeElement.load();
  }

  //开始播放
  play() {
    this.video1.nativeElement.play();
  }

  //改变视频的来源
  setSrc(src) {
    let fileServer = this.globalData.fileServer || "null";
    if (this.curriculumType == 1) {
      this.video1.nativeElement.src = fileServer + src;
      this.loadplay();
    } else if (this.curriculumType == 2) {
      //this.text1.nativeElement.src = fileServer + src;
    }

  }

  //设置或返回音频/视频是否显示控件（比如播放/暂停等）
  controls(bl: boolean) {
    this.video1.nativeElement.controls = bl;
  }

  //暂停当前播放的音频/视频
  pause() {
    this.video1.nativeElement.pause();
  }

  //设置或返回音频/视频中的当前播放位置（以秒计）
  currentTime(seconds?: number) {
    if (seconds) {
      this.video1.nativeElement.currentTime = seconds;
    } else {
      console.log("播放进度（秒）----" + this.video1.nativeElement.currentTime);
      let curr = this.video1.nativeElement.currentTime;
      let dura = this.video1.nativeElement.duration;
      //返回播放进度比例
      let a = (curr / dura) * 100;
      this.schedule = a.toFixed(2) + "%";
      console.log("播放进度（百分比）----" + this.schedule);
      return this.video1.nativeElement.currentTime;
    }
  }

  //返回当前音频/视频的长度（以秒计）
  duration(): number {
    return this.video1.nativeElement.duration;
  }

  //初始化视频触发事件
  initEvent() {
    //视频终止加载时弹出提示信息
    this.video1.nativeElement.onabort = (() => {
      console.log("视频终止加载")
    });

    //当浏览器可以开始播放音频/视频时触发。
    this.video1.nativeElement.oncanplay = (() => {
      console.log("可以开始播放")
      this.initPageHeight({});
      this._isPlay = true;
    });
    //当在音频/视频加载期间发生错误时触发。
    this.video1.nativeElement.onerror = (() => {
      console.log("视频加载期间发生错误")
      this._isPlay = false;
    });

    //当音频/视频已暂停时触发。
    this.video1.nativeElement.onpause = (() => {
      console.log("视频已暂停")
      this._isPlay = false;
    });

    //当音频/视频播放时触发。
    this.video1.nativeElement.onplay = (() => {
      console.log("视频播放")
      this._isPlay = true;
    });

    //当音频/视频在因缓冲而暂停或停止后已就绪时触发。
    this.video1.nativeElement.onplaying = (() => {
      console.log("因缓冲而暂停或停止")
      this._isPlay = false;
    });

    //当视频由于需要缓冲下一帧而停止时触发。
    this.video1.nativeElement.onwaiting = (() => {
      console.log("由于需要缓冲下一帧而停止")
      this._isPlay = false;
    });

    //当浏览器正在下载音频/视频时触发。
    this.video1.nativeElement.onprogress = (() => {
      console.log('正在下载视频！');
    });

    //当播放完成的信息
    this.video1.nativeElement.onended = (() => {
      console.log('视频播放完成！');
      this.isCwCacheComplete = false;
      this._isPlay = false;
      let oneselfCourseLearnInfo: OneselfCourseLearnInfo = this.initialization_OneselfCourseLearnInfo();
      oneselfCourseLearnInfo.isLearnFinishCw = true;//课件完成
      oneselfCourseLearnInfo.cwProgress = "100";
      oneselfCourseLearnInfo.cwPlayPosition = this.duration().toString();
      this.updateCache(oneselfCourseLearnInfo, value => {
        this.uploadCache(value, value2 => {
          this.removeCache(value2);//删除缓存
          this.playNextCourseware({});//播放下一个课件
        });//上传缓存到服务器
      });//更新播放缓存
    });
  }

  /**********************  视频播放器的js end ***********************/

  /**********************  计算播放时长js start ***********************/
  //初始化计时器
  initTimer() {
    //每秒计时器
    this._timer01 = setInterval(() => {
      // let hh = Utils.dateFormat(new Date(),"HH");
      // let mi = Utils.dateFormat(new Date(),"mm");
      // let ss = Utils.dateFormat(new Date(),"ss");

      if (this.isCwCacheComplete) {
        this.updateCache(this.initialization_OneselfCourseLearnInfo());//更新播放缓存
      }

    }, '1000');
  }

  /**********************  计算播放时长js end ***********************/


  /**********************  缓存的js start ***********************/
  //初始化缓存
  initCache(params) {
    this.storage.get("OneselfCourseLearnInfo").then((value) => {
      if (value) {
        let value2 = value;//可以将json字符串转换成json对象
        for (let key in value2) {
          let value3 = value2[key];
          let isUpload = value3.isUpload;
          if (!isUpload) {//未上传的缓存
            this.uploadCache(value3, () => {
              this.removeCache(value3);//清理缓存
            });//上传缓存到服务器
          }
        }
      }
      this.isCwCacheComplete = true;//缓存初始化完毕
      if (params.callback) {
        params.callback();
      }//回调函数
    });
  }

  //离开时处理缓存
  leaveCache() {
    this.isCwCacheComplete = false;
    clearInterval(this._timer01);//停止定时器

    this.storage.get("OneselfCourseLearnInfo").then((value) => {
      if (value) {
        let value2 = value;//可以将json字符串转换成json对象
        for (let key in value2) {
          let value3 = value2[key];
          let isUpload = value3.isUpload;
          if (!isUpload) {//未上传的缓存
            this.uploadCache(value3, () => {
              this.removeCache(value3);//清理缓存
            });//上传缓存到服务器
          }
        }
      }
    });
  }

  //更新缓存
  updateCache(param: OneselfCourseLearnInfo, callback?) {
    let a = {};
    a[this.leac001 + "_" + this._currentCoursewareId + "_" + this.globalData.userId] = param;
    this.storage.set("OneselfCourseLearnInfo", a).then(value => {
      if (callback) {
        callback(param);
      }//回调函数
    });
  }

  //上传缓存到服务器
  uploadCache(param: OneselfCourseLearnInfo, callback?) {
    this.httpService.postFormData('/study/exitViewRecordCurrentProgress', {
      USER001: param.userId,
      LEAC001: param.courseId,
      COUR001: param.coursewareId,
      LCWR007: param.cwPlayPosition,
      LCWR008: param.cwProgress,
      LCWR010: param.isLearnFinishCw ? 1 : 0,
      LCWR011: param.cwPageCurrNum,
      LERE008: param.isPass
    }).subscribe(res => {
      if (callback) {
        callback(param);
      }//回调函数
    }, e => {
      console.error("uploadCache error:" + e);
    });
  }

  //清理缓存
  removeCache(param: OneselfCourseLearnInfo) {
    this.storage.get("OneselfCourseLearnInfo").then((value) => {
      let leac001 = param.courseId;
      let cwid = param.coursewareId;
      let userid = param.userId;
      delete value[leac001 + "_" + cwid + "_" + userid];
      this.storage.set("OneselfCourseLearnInfo", value);
    });
  }

  //实例化一个OneselfCourseLearnInfo
  initialization_OneselfCourseLearnInfo(): OneselfCourseLearnInfo {
    let nowDate = new Date().getTime();
    //console.log("-----nowDate:"+nowDate);
    //1视频  2文档
    if (this.curriculumType == 1) {
      let videoLength: number = this.duration();
      let cwPlayPosition: number = this.currentTime().toFixed(0);
      let cwProgress: string = ((cwPlayPosition / videoLength) * 100).toFixed(0);//四舍五入
      return {
        courseId: this.leac001,
        coursewareId: this._currentCoursewareId,
        userId: this.globalData.userId,
        cwPlayPosition: cwPlayPosition.toString(),
        isUpload: false,
        cwProgress: cwProgress,
        isLearnFinishCw: false,
        isPass: 0,
        cTime: nowDate
      };
    } else if (this.curriculumType == 2) {
      let cwPageNum = this._cwPageNum;
      let cwNowPageIndex = this._cwNowPageIndex;
      let cwProgress: string = ((cwNowPageIndex / cwPageNum) * 100).toFixed(0);//四舍五入
      return {
        courseId: this.leac001,
        coursewareId: this._currentCoursewareId,
        userId: this.globalData.userId,
        isUpload: false,
        cwProgress: cwProgress,
        isLearnFinishCw: false,
        cwPageCurrNum: cwNowPageIndex,
        isPass: 0,
        cTime: nowDate
      };
    }
  }

  /**********************  缓存的js end ***********************/


  /**********************  页面的js start ***********************/
  //初始化页面高度
  initPageHeight(params) {
    console.log("初始化页面高度")
    this.tipsSectionHeight = this.coursewareDiv.nativeElement.offsetHeight;
    // this.detailsTabHeight = this.tipsSection.nativeElement.offsetHeight  + this.coursewareDiv.nativeElement.offsetHeight+this.headerEle.nativeElement.offsetHeight;
    this.detailsBodyHeight = this.tipsSection.nativeElement.offsetHeight + this.coursewareDiv.nativeElement.offsetHeight + this.detailsTab.nativeElement.offsetHeight - 12;
    if (params.callback) {
      params.callback();
    }//回调函数
  }

  //切换标签
  switchLabel(obj) {
    this.detailsUlLiCur = obj;
  }

  //查看结业条件
  conditionsOfCompletion() {
    this.isConditionsOfCompletion = this.isConditionsOfCompletion == 1 ? 0 : 1;
    if (this.isConditionsOfCompletion == 0) {
      this.detailsBodyHeight = this.detailsBodyHeight + 32;
    } else {
      this.detailsBodyHeight = this.detailsBodyHeight - 32;
    }
  }

  //加载执行顺序
  runImplementFun(implementFun?: Array<ImplementFun>): void {
    if (!implementFun) {
      implementFun = this.implementFun;
    }
    if (implementFun.length == 0) {
      return;
    }
    let iFun = implementFun.shift();//取数组第一位
    let funname = iFun.functionName;
    let sync = iFun.synchronization == undefined ? true : iFun.synchronization;//如果undefined默认true
    if (sync) {
      //同步执行方法
      this[funname]({
        callback: (() => {
          this.runImplementFun(implementFun);
        })
      });
    } else {
      //异步执行方法
      this[funname]();
      this.runImplementFun(implementFun);
    }
  }

  //获取列表（默认加载10条）
  requestDataList(url: string, paramMap?) {
    return this.commonService.getPage(url, paramMap);
  }

  /***********************************请求接口***************************************/
  //课程预览-课件列表
  initCatalogData(params) {
    this.catalogUnRecord = false;
    this.requestDataList("/study/query_studycourseware", {LEAC001: this.leac001}).subscribe(data => {
      if (data.courseWareList && data.courseWareList.length >= 1) {
        this.catalogItems = data.courseWareList;
      } else {
        this.catalogUnRecord = true;
      }
      if (params.callback) {
        params.callback();
      }//回调函数
    });
  }

  //课程预览-课程详情
  initCourseInfoData(params) {
    this.requestDataList("/study/query_studyCourseInfo", {LEAC001: this.leac001}).subscribe(data => {
      this.courseInfoMapItems = data.courseInfoMap;
      this.speakerListItems = data.speakerList;
      if (params.callback) {
        params.callback();
      }//回调函数
    });
  }


  //-课程预览-单类评论(好评 中评 差评)
  initEvaluateData(params) {
    this.evaluateUnRecord = false;
    this.requestDataList("/study/query_studyCourseSingleEvaluation", {LEAC001: this.leac001}).subscribe(data => {
      if (data.singleEvaluationList && data.singleEvaluationList.length >= 1) {
        this.evaluateItems = data.singleEvaluationList;
      } else {
        this.evaluateUnRecord = true;
      }
      if (params.callback) {
        params.callback();
      }//回调函数
    });
  }

  //-课程预览-点击单类评论(好评 中评 差评)
  initClickEvaluateData(params) {
    this.cur = params;
    if(params==-1){
      params='';
    }
    this.requestDataList("/study/query_studyCourseSingleEvaluation", {
      LEAC001: this.leac001,
      USER001:this.globalData.userId,
      UMES005:params
    }).subscribe(data => {
      this.evaluateItems = data.singleEvaluationList;
    });
  }


  //-课程预览-评论数目(全部 好评 中评 差评)
  initCourseEvaluationData(params) {
    this.evaluateUnRecord = false;
    this.requestDataList("/study/query_studyCourseEvaluation", {
      USER001: this.globalData.userId,
      LEAC001: this.leac001
    }).subscribe(data => {
      this.evaluationNumMapItem = data.evaluationNumMap;
      if (params.callback) {
        params.callback();
      }//回调函数
    });
  }

  //获取当前课件播放次数
  initTimesAndPraiseNumData(params) {
    this.requestDataList("/study/studyTimesAndPraiseNum", {
      USER001: this.globalData.userId,
      LEAC001: this.leac001
    }).subscribe(data => {
      this.timesNumMap = data.timesNumMap;
      if (params.callback) {
        params.callback();
      }//回调函数
    });
  }

  //课程信息-结业条件
  initGraduationConditionData(params) {
    this.requestDataList("/study/graduationCondition", {
      USER001: this.globalData.userId,
      LEAC001:this.leac001
    }).subscribe(data => {
      this.completionMap = data.completionMap;
      if (params.callback) {
        params.callback();
      }//回调函数
    });
  }

  /***********************************请求接口--END***************************************/


  //目录下滑加载
  doCatalogInfinite(infiniteScroll) {
    this.requestDataList("/study/query_studycourseware", {
      LEAC001: this.leac001,
      START: ++this.catalogStart
    }).subscribe(data => {
      if (data.courseWareList && data.courseWareList.length >= 1) {
        this.catalogItems = data.courseWareList;
        if (infiniteScroll.callback) {
          this[infiniteScroll.callback](infiniteScroll.callbackParam);
        }
      } else {
        if (infiniteScroll.enable) {
          infiniteScroll.enable(false);
        }
        if (this._currentCoursewareId == "" && this.catalogItems.length >= 1 && !infiniteScroll.enable) {
          this._currentCoursewareId = this.catalogItems[0].COUR001;
          this.playCourseware(this.catalogItems[0]);//播放第一个视频
        }
      }
      if (infiniteScroll.complete) {
        infiniteScroll.complete();
      }
    });
  }

  //评价下滑加载
  doEvaluateInfinite(infiniteScroll) {
    this.requestDataList("/study/query_studycourseware", {
      LEAC001: this.leac001,
      START: ++this.evaluateStart
    }).subscribe(data => {
      if (data.singleEvaluationList && data.singleEvaluationList.length >= 1) {
        this.evaluateItems = data.singleEvaluationList;
      } else {
        if (infiniteScroll.enable) {
          infiniteScroll.enable(false);
        }
      }
      if (infiniteScroll.complete) {
        infiniteScroll.complete();
      }
    });
  }

  //资料下滑加载
  doMaterialInfinite(infiniteScroll) {
    this.requestDataList("/study/query_studycourseware", {
      LEAC001: this.leac001,
      START: ++this.materialStart
    }).subscribe(data => {
      if (data.onlineStudyList && data.onlineStudyList.length >= 1) {
        this.materialItems = data.onlineStudyList;
      } else {
        infiniteScroll.enable(false);
      }
      infiniteScroll.complete();
    });
  }

  //初始化播放课件
  initCourseware(params) {
    if (!this._isPlay) {//判断是否播放，正在播放不切换课件
      let cLeng = this.catalogItems.length;
      for (let i = 0; i < cLeng; i++) {
        let currentCourseware = this.catalogItems[i];
        let nowCwId = currentCourseware.COUR001;
        let nowCwProgress = currentCourseware.LCWR008;//进度
        if (nowCwProgress == "100") {//进度100%
          continue;
        }
        this._currentCoursewareId = nowCwId;
        this._nowCwItem = currentCourseware;
        break;
      }
      if (this._currentCoursewareId != "") {
        this.playCourseware(this._nowCwItem);
      } else {
        this.doCatalogInfinite({callbackName: "initCourseware"});
      }
    }
    if (params.callback) {
      params.callback();
    }//回调函数
  }

  //播放下一个课件
  playNextCourseware(params) {
    let nowCwId = params.COUR001;
    if (nowCwId && nowCwId != "") {
      let cLeng = this.catalogItems.length;
      let f1 = false;
      for (let i = 0; i < cLeng; i++) {
        let currentCourseware = this.catalogItems[i];
        let nowCwId2 = currentCourseware.COUR001;
        let nowCwProgress = currentCourseware.LCWR008;//进度
        if (!f1) {
          if (nowCwId != nowCwId2) {
            continue;
          } else {
            f1 = true;
          }
        }
        if (nowCwProgress == "100") {//进度100%
          continue;
        }
        this._currentCoursewareId = nowCwId;
        this._nowCwItem = currentCourseware;
        break;
      }
      if (this._currentCoursewareId != "") {
        this.playCourseware(this._nowCwItem);
        this.isCwCacheComplete = true
      } else {
        this.doCatalogInfinite({callbackName: "playNextCourseware", callbackParam: params});
      }
    } else {
      if (this._currentCoursewareId == "") {
        let cLeng = this.catalogItems.length;
        if (cLeng >= 1) {
          this.playNextCourseware(this.catalogItems[0]);//播放第一个
        }
      } else {
        this.playNextCourseware({COUR001: this._currentCoursewareId});
      }
    }
  }

  //播放课件
  playCourseware(params) {
    let nowCwId = params.COUR001;
    let nowCwType = params.COUR003;
    this._isPlay = true;//播放状态
    this._currentCoursewareId = nowCwId;
    this._nowCwItem = params;
    //把其他目录置为为被选中状态
    for (let i = 0; i < this.catalogItems.length; i++) {
      this.catalogItems[i].isCur = 0;
    }
    params.isCur = 1;//选中这个课件目录
    //curriculumType 课程类型  1 视频   2 文档
    if (nowCwType == "1") {//视频课件
      this.curriculumType = 1;
      this.initEvent();//初始化播放器事件
      this.setSrc(params.COUR006);
      if (params.LCWR007 && params.LCWR007 != "0" && params.LCWR007 != "100") {
        this.currentTime(params.LCWR007);//设置播放位置
      }
      this.lecw009 = params.LECW009;
      this.play();//开始播放
    } else if (nowCwType == "0") {//文档课件
      this.curriculumType = 2;
      this.setSrc(params.COUR006);
    }
    if (params.callback) {
      params.callback();
    }//回调函数
  }

  //点击放大文本文件
  /*ohToBig(){
    let loginModal = this.modalCtrl.create('LoginPage', {});
    loginModal.present();
  }*/


  /**********************  页面的js end ***********************/

}
