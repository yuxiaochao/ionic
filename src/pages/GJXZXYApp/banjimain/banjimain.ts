import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {NativeService} from "../../../providers/NativeService";
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";
import {BanjixiangcePage} from "./banjixiangce/banjixiangce";
import {MoreclassPage} from "./moreclass/moreclass";
import {MorebijiPage} from "./morebiji/morebiji";
import {Storage} from "@ionic/storage";
import {TrainingCourseListPage} from "./training-course-list/training-course-list";


@IonicPage()
@Component({
  selector: 'page-banjimain',
  templateUrl: 'banjimain.html',
})
export class BanjimainPage {

  noteList: any = [];//今日笔记
  courName: string;//培训班名称
  trainCourseNumber: number;
  OnlineElectivecourseListPage: string;   //基本信息
  OnlineStudyListPage: string;            //课程表
  OnlineExamListPage: string;             //通知公告
  ExamExercisesListPage: string;          //讲义下载
  StandardsTrainListPage: string;         //班级相册
  QuestionnaireListPage: string;           //班级交流
  JibenxinxiPage: string;             //基本信息
  KechengbiaoPage: string;            //课程表
  TongzhigonggaoPage: string;         //通知公告
  JiangyixiazaiPage: string;          //讲义下载
  BanjixiangcePage: string;           //班级相册
  BanjijiaoliuPage: string;            //班级交流


  constructor(public globalData: GlobalData,
              public commonService: CommonService,
              public nativeService: NativeService,
              public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,) {
    this.JibenxinxiPage = "JibenxinxiPage";
    this.KechengbiaoPage = "KechengbiaoPage";
    this.TongzhigonggaoPage = "TongzhigonggaoPage";
    this.JiangyixiazaiPage = "JiangyixiazaiPage";
    this.BanjixiangcePage = "BanjixiangcePage";
    this.BanjijiaoliuPage = "BanjijiaoliuPage";
    this.QuestionnaireListPage = "QuestionnaireListPage";
    this.OnlineElectivecourseListPage = "JibenxinxiPage";
    this.OnlineStudyListPage = "KechengbiaoPage";
    this.OnlineExamListPage = "TongzhigonggaoPage";
    this.ExamExercisesListPage = "JiangyixiazaiPage";
    this.StandardsTrainListPage = "BanjixiangcePage";
  }

  ionViewDidEnter() {
    let trainCourse = this.globalData.currentTrainingClass;
    if (!trainCourse) {
      this.courName = '暂无班级';
    } else {
      this.courName = trainCourse["TRPR002"];
    }
    this.findnoteList();
    this.trainCourseNumber = this.globalData.myTrainingClass.length;
  }


  //今日笔记
  findnoteList() {
    this.commonService.getPage('/huarui/XzxyNoteBook/findNoteBook', {
      TYPE: 0
    }).auditTime(500).subscribe(data => {
      if (data) {
        this.noteList = data.noteList;
      }
    })
  }

  //切换培训班
  changeOne() {
    let course = this.globalData.currentTrainingClass;
    this.navCtrl.push('TrainingCourseListPage', {
      callback: (data1, data2) => {
        return new Promise((resolve, reject) => {
          this.courName = data2;
          resolve();
        });
      },
      trainCourseId: course["TRUS016"]
    });
  }

  moreclassClick() {
    this.navCtrl.push("MoreclassPage");
  }

  addbiji() {
    this.navCtrl.push("AddbijiPage");
  }

  morebiji() {
    this.navCtrl.push('MorebijiPage');
  }

  tosign() {
    this.navCtrl.push('ClassCheckinPage');
  }

}
