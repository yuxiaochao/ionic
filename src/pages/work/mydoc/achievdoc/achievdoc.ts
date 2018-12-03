import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the AchievdocPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-achievdoc',
  templateUrl: 'achievdoc.html',
})
export class AchievdocPage {

  factsName:string;//纪实任务名称
  factsId:string;//纪实任务ID
  taskList:any=[]//完成的任务列表
  dofa003:string;//纪实内容
  dofa004:number;//纪实来源
  dofa009='';//任务ID
  taskHistoryList=[];//纪实历史记录
  flage=1;// 1.添加 2.修改 3.不能用
  dofa001='';
  sign=0;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService,
              public alert:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DutydocPage');
    this.initDate()
  }

  initDate(){
    this.initInfo({DOFA005:2}).auditTime(500).subscribe(data=>{
      if(data){

        let factsTask=data.factsTask;
        this.factsName=factsTask["dofa002"];
        this.factsId=factsTask["dofa001"];

        let flage=data.flage;
        if(flage){
          this.flage=3;
        }else{
          this.flage=1;
        }
        this.taskHistoryList=data.taskHistoryList
      }
    })
  }

  initInfo(paramMap?){
    return this.commonService.getPage('/huarui/hrswTDocumentaryfactstask/quitFactsTask',paramMap);
  }

  //完成
  submitInfo(obj){
    if(!this.dofa003){
      let alert=this.alert.create({
        title:'提交内容不能为空！',
        buttons:[{
           text:'确定',
           handler:()=>{

           }
        }]
      }).present();
    }else {
      this.commonService.getPage('/huarui/hrswTDocumentaryfacts/insertFact', {
        TYPE: obj,
        DOFA001: this.dofa001,
        DOFA002: this.factsId,
        DOFA003: this.dofa003,
        DOFA004: 2,
        DOFA005: 2,
        DOFA009: this.dofa009

      }).auditTime(500).subscribe(data => {
        if (data) {
          let flage = data.flage;
          if (flage) {
            if (obj == 1) {
              let alert = this.alert.create({
                title: '提交成功！',
                buttons: [{
                  text: '确定',
                  handler: () => {
                    this.flage = 1
                    this.dofa003 = '';
                    this.initDate();
                  }
                }]
              }).present()

            } else if (obj == 2) {
              let alert = this.alert.create({
                title: '修改成功！',
                buttons: [{
                  text: '确定',
                  handler: () => {
                    this.flage = 1
                    this.dofa003 = '';
                    this.initDate();
                  }
                }]
              }).present()
            }

          } else {
            let alert = this.alert.create({
              title: '提交失败,请您稍后再试！',
              buttons: [{
                text: '确定',
                handler: () => {
                  this.flage = 1
                }
              }]
            }).present()
          }
        }

      })
    }
  }

  changeFact(obj){
    this.flage=2
    this.dofa001=obj.DOFA001;
    this.dofa003=obj.DOFA003;
    this.dofa004=obj.DOFA004;
    this.dofa009=obj.DOFA009;
    this.factsId=obj.DOFA002;
  }

}
