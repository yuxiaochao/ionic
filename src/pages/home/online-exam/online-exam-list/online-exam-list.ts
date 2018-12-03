import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {GlobalData} from "../../../../providers/GlobalData";

@IonicPage()
@Component({
  selector: 'page-online-exam-list',
  templateUrl: 'online-exam-list.html',
})
export class OnlineExamListPage {
  items : any = [];
  start : number = 1;
  unRecord : boolean = false;
  myInput : string = '';
  tact005:number = 1;
  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  @ViewChild(Navbar) navbar : Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService,
              public globalData : GlobalData) {

  }


  ionViewDidEnter(){
    this.initData();
  }

  initData(){
    this.tact005 = this.navParams.get("tact005");
    this.content.scrollToTop(0);
    this.unRecord = false;
    this.start=1;
    this.infiniteScroll.enable(true);
    this.initOnlineList({}).subscribe(data=>{
      if(data.data.length > 0){
        this.items = data.data;
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

  ionBlur(){
    this.navbar.hideBackButton=false;
  }

  ionCancel(){
    this.navbar.hideBackButton=false;
    this.initData();
  }

  ionClear(){
    this.initData();
  }

  ionInput(ev: any){
    this.infiniteScroll.enable(true);
    this.content.scrollToTop(0);
    this.globalData.showLoading = false;
    this.initOnlineList({KEYWORD:ev.target.value,START:1}).subscribe(data=>{
      if(data.data.length > 0){
        this.unRecord = false;
        this.items = data.data;
      }else{
        this.items = [];
        this.unRecord = true;
      }
    })
    setTimeout(() => {
      this.globalData.showLoading = true;
    }, 50);
  }
  //获取考试列表（默认加载10条）
  initOnlineList(paramMap){
    paramMap.tact005 = this.tact005;
   return this.commonService.getPage('/exam/query_onlineExam',paramMap);
  }

  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;
    this.initOnlineList({KEYWORD:this.myInput,START:++this.start})
      .auditTime(500)
      .subscribe(data=>{
        if(data.data.length > 0){
          this.items = this.items.concat(data.data);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

    })
    this.globalData.showLoading = true;
  }

  doRefresh(refresher){
    this.initData();
    refresher.complete();
  }

  intoExamDetail(item){
    this.navCtrl.push('OnlineExamDetailPage',{tact001:item.TACT001,tact005:this.tact005});
  }

}
