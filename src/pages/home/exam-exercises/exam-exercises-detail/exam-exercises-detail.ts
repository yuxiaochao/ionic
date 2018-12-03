import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ExamExercisesService} from "../../../../service/exam-exercises/ExamExercisesService";

@IonicPage()
@Component({
  selector: 'page-exam-exercises-detail',
  templateUrl: 'exam-exercises-detail.html',
})
export class ExamExercisesDetailPage {

  //按题库、按知识点
  exerciseType:string;
  //题库练习id
  exer001:string;
  items:Array<Object>;//题库列表
  knowItems:Array<Object>;//知识点列表
  circle = {};
  randomTopicNum:number; //随机试题数
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public examExercisesService:ExamExercisesService,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.exerciseType = "exercise";
    this.exer001 = this.navParams.get("exer001");
    this.initData();
  }

  initData(){
    this.examExercisesService.getExerciseDetail({exer001:this.exer001}).subscribe(data=>{
      if(data)
        this.items = data.exerciseList;
        this.knowItems = data.knowledgeList;
    });
  }

  back(){
    this.navCtrl.pop();
  }
  //查看二级题库
  toggleCircle(itemIndex,item){
    if(item.CATA004 == '-1'){
      this.circle['circle_'+itemIndex] = !this.circle['circle_'+itemIndex];
      if(!item.childItems){
        this.getSecondaryExercise(item);
      }
    }
  }
  //获取二级题库
  getSecondaryExercise(item){
    this.examExercisesService.getSecondaryExercise({exer001:this.exer001,exer009:item.CATA001}).subscribe(data=>{
      item.childItems = data.exerciseList;
    });
  }

  //答题
  answerExercise(item,exsa010){
    this.initTopicPrompt(item,exsa010);
  }

  initTopicPrompt(item,exsa010){
    let alert = this.alertCtrl.create();
    alert.setTitle('随机抽取');

    alert.addInput({
      type: 'radio',
      label: '15道题',
      value: '15',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: '30道题',
      value: '30'
    });

    alert.addInput({
      type: 'radio',
      label: '60道题',
      value: '60'
    });

    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.randomTopicNum = data;
        this.beginAnswer(item,exsa010);
      }
    });
    alert.present();
  }

  beginAnswer(item,exsa010){
    let cata001 ="-1";
    let topi003 = "";
    if(item.CATA001)
      cata001 = item.CATA001;
    if(item.TOPI003){
      topi003 = item.TOPI003;
    }

    this.navCtrl.push('ExamExercisesTestPage',{exer001:this.exer001,
      cata001:cata001,
      topi003:topi003,
      exsa010:exsa010,
      randomTopicNum:this.randomTopicNum});
  }
}
