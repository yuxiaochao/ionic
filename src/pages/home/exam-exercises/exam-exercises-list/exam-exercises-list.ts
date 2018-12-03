import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {ExamExercisesService} from "../../../../service/exam-exercises/ExamExercisesService";
import {GlobalData} from "../../../../providers/GlobalData";
@IonicPage()
@Component({
  selector: 'page-exam-exercises-list',
  templateUrl: 'exam-exercises-list.html',
})
export class ExamExercisesListPage {

  items : any = [];
  start : number = 1;
  unRecord : boolean = false;
  myInput : string = '';
  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  @ViewChild(Navbar) navbar : Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public examExercisesService:ExamExercisesService,
              public globalData:GlobalData,
              public alertCtrl: AlertController) {
  }


  ionViewDidLoad() {
   this.initData();
  }

  initData(){
    this.content.scrollToTop(0);
    this.unRecord = false;
    this.start=1;
    this.infiniteScroll.enable(true);
    this.examExercisesService.getExamExercisesList().subscribe(data=>{
      if(data.items.length > 0){
        this.items = data.items;
        if(this.items.length <= 10){
          this.infiniteScroll.enable(false);
        }
      }else{
        this.unRecord = true;
      }
    });
  }

  ionFocus(){
    this.navbar.hideBackButton=true;
  }

  ionCancel(){
    this.navbar.hideBackButton=false;
    this.initData();
  }

  ionBlur(){
    this.navbar.hideBackButton=false;
  }

  ionClear(){
    this.initData();
  }


  ionInput(ev: any){
    this.infiniteScroll.enable(true);
    this.content.scrollToTop(0);
    this.globalData.showLoading = false;
    this.examExercisesService.getExamExercisesList({KEYWORD:ev.target.value,START:1}).subscribe(data=>{
      if(data.items.length > 0){
        this.unRecord = false;
        this.items = data.items;
      }else{
        this.items = [];
        this.unRecord = true;
      }
    })
    this.globalData.showLoading = true;
  }

  //加载更多数据
  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;
    this.examExercisesService.getExamExercisesList({KEYWORD:this.myInput,START:++this.start})
      .auditTime(500)
      .subscribe(data=>{
        if(data.data.length > 0){
          this.items = this.items.concat(data.items);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      })
    setTimeout(() => {
      this.globalData.showLoading = true;
    }, 50);
  }

  //进入题库练习
  intoExercisesDetail(item){
    if(item.TYPE == '1'){
      this.exerciseConfirm(item);
    }else {
      this.navCtrl.push('ExamExercisesDetailPage',{exer001:item.EXER001});
    }

  }

  //提示是否重新答题
  exerciseConfirm(item){
    let confirm = this.alertCtrl.create({
      title: '您上次练习未提交',
      message: '',
      buttons: [
        {
          text: '我要重新抽题',
          handler: () => {
            this.navCtrl.push('ExamExercisesDetailPage',{exer001:item.EXER001});
          }
        },
        {
          text: '继续上次练习',
          handler: () => {
            this.navCtrl.push('ExamExercisesTestPage',{exer001:item.EXER001,exgr001:item.EXGR001});
          }
        }
      ]
    });
    confirm.present();
  }

  //获取二级题库记
}
