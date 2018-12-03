import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";

/**
 * Generated class for the ExamnotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-examnotes',
  templateUrl: 'examnotes.html',
})
export class ExamnotesPage {

  items :any = [];
  unRecord : boolean = false;
  myInput : string = '';
  start : number = 1;

  @ViewChild(Navbar) navbar : Navbar;
  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService,
              public globalData: GlobalData) {
  }

  ionViewDidLoad() {

    //初始化界面
    this.initDate();
  }
  initDate(){
    this.content.scrollToTop(0);
    this.unRecord = false;
    this.start=1;
    this.infiniteScroll.enable(true);
    this.initInfo().subscribe(data=>{
      if(data.examHistory && data.examHistory.length >= 1){
        this.items = data.examHistory;
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
    this.initDate();
  }

  ionClear(){
    this.initDate();
  }

  ionInput(ev: any){
    if(!ev.target.value){
      return;
    }
    this.infiniteScroll.enable(true);
    this.content.scrollToTop(0);
    this.globalData.showLoading = false;
    this.initInfo({KEYWORD:ev.target.value,START:1}).subscribe(data=>{
      if(data.examHistory.length >= 1){
        this.unRecord = false;
        this.items = data.examHistory;
      }else{
        this.items = [];
        this.unRecord = true;
      }
    })
    this.globalData.showLoading = true;
  }

  initInfo(paramMap?){

    return this.commonService.getPage('/mine/examHistory',paramMap);
  }


  //加载
  doInfinite(infiniteScroll){
    this.globalData.showLoading = false;
    this.initInfo({KEYWORD:this.myInput,START:++this.start})
      .auditTime(500)
      .subscribe(data=>{
        if(data.examHistory.length > 0){
          this.items = this.items.concat(data.examHistory);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      })
    this.globalData.showLoading = true;

  }

}
