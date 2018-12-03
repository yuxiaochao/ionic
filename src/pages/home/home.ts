import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {GlobalData} from "../../providers/GlobalData";
import {NativeService} from "../../providers/NativeService";
import {CommonService} from "../../service/CommonService";
import {QuestionnaireTestPage} from "./questionnaire/questionnaire-test/questionnaire-test";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  OnlineExamListPage: string;//在线考试、模拟练习
  OnlineElectivecourseListPage: string;//在线考试、模拟练习
  OnlineStudyListPage: string; //在线学习
  ErrorTopicListPage: string; //错题中心
  ExamExercisesListPage: string; //题库练习
  StandardsTrainListPage: string; //达标训练
  ExaplePage : string;           // 到期提醒
  DatePage : string;           // 到期提醒
  examParams: Object; //在线考试参数
  exerciseParams: Object; //模拟练习参数
  HomeInfoitems: any = [];//门户首页信息
  newestCourseItems: any = [];//最新课程列表
  recentQuestionnaireItems: any = [];//近期问卷调查列表
  recentExamItems: any = [];//近期考试列表
  rotaryPressItems: any = [];//轮转图片
  hottestCourseItems: any = [];//热门课程列表
  QuestionnaireListPage:string;//问卷调查


  constructor(public navCtrl: NavController,
              public globalData: GlobalData,
              public commonService : CommonService,
              public nativeService: NativeService
  ) {
    this.OnlineExamListPage = "OnlineExamListPage";
    this.ErrorTopicListPage = "ErrorTopicListPage";
    this.ExamExercisesListPage = "ExamExercisesListPage";
    this.StandardsTrainListPage = "StandardsTrainListPage";
    this.ExaplePage = 'ExaplePage';
    this.DatePage = 'DatePage';
    this.examParams = {tact005: 1};
    this.exerciseParams = {tact005: 9};
    this.OnlineStudyListPage = "OnlineStudyListPage";
    this.OnlineElectivecourseListPage = "OnlineElectivecourseListPage";
    this.QuestionnaireListPage = "QuestionnaireListPage";
  }

  ionViewDidEnter() {
    this.initHomeInfoList({USER001:this.globalData.userId}).subscribe(data => {
      this.newestCourseItems = data.newestCourseList;
      this.HomeInfoitems = data.portalInfo;
      this.rotaryPressItems = data.rotaryPress;
      this.recentExamItems = data.recentExamList;
      this.recentQuestionnaireItems = data.recentQuestionnaireList;
      this.newestCourseItems = data.newestCourseList;
      this.hottestCourseItems = data.hottestCourseList;
    });
  }

  //获取门户信息
  initHomeInfoList(paramMap?) {
    return this.commonService.getPage('/home/info', paramMap);
  }
  //进入考试
  intoExamDetail(item){
    this.navCtrl.push('OnlineExamDetailPage',{tact001:item.TACT001});
  }
  //进入学习
  intoStudyDetail(item){
    this.navCtrl.push('OnlineStudyMainPage',{leac001:item.LEAC001});
  }
  //进入调查
  intoQuestionnaire(item){
    this.navCtrl.push('QuestionnaireTestPage', {
      QUES001: item.QUES001,
      QUES009: item.QUES009
    });
  }




}
