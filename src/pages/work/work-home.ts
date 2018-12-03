import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {WaitconfirmPage} from "./Todo/waitconfirm/waitconfirm";
import {WeekmeetingPage} from "./Todo/weekmeeting/weekmeeting";
import {AttendanceCheckPage} from "./Todo/attendance-check/attendance-check";
import {AttendanceCheckinPage} from "./attendance-checkin/attendance-checkin";
import {CommonService} from "../../service/CommonService";
import {Utils} from "../../providers/Utils";
import {TaskListPage} from "./Todo/weektask/task-list/task-list";

/**
 * Generated class for the WorkHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-work-home',
  templateUrl: 'work-home.html',
})
export class WorkHomePage {

  factsId:string;//纪实任务ID
  WaitconfirmPage:String;//待我确认
  TaskListPage:String;//本周任务
  WeekmeetingPage:String;//本周会议
  AttendancePage:String; //出勤签到
  AttendanceCheckinPage:string;//出勤签到
  ConferencelistPage:string;//会议签到
  TasklistPage:string;//任务签到
  TaskevaluationPage:string;//任务评价
  DutydocPage:string;//履职纪实
  AchievdocPage:string;//实绩纪实
  ProblemdocPage:string;//问题纪实

  noReaderTaskNumber=0;
  noReaderMeetNumber=0;
  noReaderFactNumber=0;
  identity:number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private commonService:CommonService,
              private alert:AlertController ) {
    this.WaitconfirmPage = 'WaitconfirmPage';
    this.TaskListPage = 'TaskListPage';
    this.WeekmeetingPage = 'WeekmeetingPage';
    this.AttendancePage ='AttendanceCheckPage';
    this.AttendanceCheckinPage='AttendanceCheckinPage';
    this.ConferencelistPage="ConferencelistPage";
    this.TasklistPage="TasklistPage";
    this.TaskevaluationPage='TaskevaluationPage';
    this.DutydocPage='DutydocPage'
    this.AchievdocPage='AchievdocPage';
    this.ProblemdocPage='ProblemdocPage';
    this.identity =0 ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkHomePage');
  this.identificationOfIdentity();
  }
  ionViewDidEnter(){
    this.identificationOfIdentity();
  }

  identificationOfIdentity(){
    this.commonService.getPage('/huarui/hrswTDocumentaryfactsreport/selectIdentity',).subscribe(data=>{
      if(data.flage){
        this.identity=1
        this.searchNoReaderTask();
        this.serchNoReaderMeet();
        this.serchNoReaderFact();

      }else{
        this.identity=0
        this.noReaderTaskNumber=0
        this.searchNoReaderTask();
        this.serchNoReaderMeet();
      }
    })
  }


  searchNoReaderTask(){

    this.commonService.getPage('/huarui/hrswTCalendartask/queryNoReaderTask')
      .subscribe(data=>{
          if(data){
            this.noReaderTaskNumber=data.noReaderNumber
          }
    })
  }

  serchNoReaderMeet(){

    this.commonService.getPage('/huarui/hrswTCalendarmeeting/selectNoReaderMeetNum')
      .subscribe(data=>{
        if(data){
          this.noReaderMeetNumber=data.noReaderMeetNum
        }
      })
  }

  serchNoReaderFact(){

    this.commonService.getPage('/huarui/hrswTDocumentaryfactsreport/selectNoReaderReportNum')
      .subscribe(data=>{
        if(data){
          this.noReaderFactNumber=data.noReaderNum
        }
      })
  }

  factsReport(){
    this.commonService.getPage('/huarui/hrswTDocumentaryfactstask/quitFactsTask',{DOFA005:4})
      .auditTime(500).subscribe(data=>{
        if(data){
          let factsTask=data.factsTask;
          this.factsId=factsTask["dofa001"];
          let flage=data.flage;
          if(flage){
            let alert=this.alert.create({
              title:'您已经提交过一次，不能重复提交',
              buttons:[{
                   text:'确定',
                   handler:()=>{

                   }
              }]
            }).present()

          }else if(Utils.dateFormat(new Date(),'yyyy-mm-dd hh24:mi:ss')>factsTask["dofa004"]){
            let alert=this.alert.create({
              title:'该纪实任务已过期，请您联系管理员!',
              buttons:[{
                text:'确定',
                handler:()=>{

                }
              }]
            }).present()


          }else{
            let alert=this.alert.create({
              title:'上报提醒!',
              subTitle:'确定要将本次干部纪实表上报给党建办吗?',
              buttons:[{
                text:'确定',
                handler:()=>{
                  this.commonService.getPage('/huarui/hrswTDocumentaryfacts/insertFactsReport',{DOFR002:this.factsId})
                    .auditTime(500).subscribe(data01=>{
                    if(data01.flage){
                      let alert=this.alert.create({
                        title:'上报成功!',
                        buttons:[{
                          text:'确定',
                          handler:()=>{
                            this.serchNoReaderFact();
                          }
                        }]
                      }).present()
                    }

                  })
                }
              },{
                text:'取消',
                handler:()=>{

                }
              }]

            }).present()
          }
        }
    })

  }

}
