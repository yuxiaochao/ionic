import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {GlobalData} from "../../../../providers/GlobalData";

/**
 * Generated class for the OnlineStudyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-online-study-list',
  templateUrl: 'online-study-list.html',
})
export class OnlineStudyListPage {

  items : any = [];//全局变量   列表数据
  start : number = 1;
  unRecord : boolean = false;
  myInput : string = '';

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
    this.content.scrollToTop(0);//滚动到最上面
    this.unRecord = false;
    this.start=1;//分页   第一页
    this.infiniteScroll.enable(true);//初始化  滚动
    this.initOnlineList()
      .subscribe(data=>{//处理接口返回的数据，必须调用
      if(data.onlineStudyList && data.onlineStudyList.length >= 1){
        this.items = data.onlineStudyList;
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

  ionClear(){
    this.initData();
  }

  ionInput(ev: any){
    if(!ev.target.value){
      return;
    }
    this.infiniteScroll.enable(true);
    this.content.scrollToTop(0);
    this.globalData.showLoading = false;
    this.initOnlineList({KEYWORD:ev.target.value,START:1}).subscribe(data=>{
      if(data.onlineStudyList.length > 0){
        this.unRecord = false;
        this.items = data.onlineStudyList;
      }else{
        this.items = [];
        this.unRecord = true;
      }
    });
    this.globalData.showLoading = true;
  }
  //获取考试列表（默认加载10条）
  initOnlineList(paramMap?){
    //请求接口   url  /study/onlineStudyList
    return this.commonService.getPage('/study/onlineStudyList',paramMap);
  }

  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;
    this.initOnlineList({KEYWORD:this.myInput,START:++this.start})
      .auditTime(500)
      .subscribe(data=>{
        if(data.onlineStudyList.length > 0){
          this.items = this.items.concat(data.onlineStudyList);
        }else{
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      })
    this.globalData.showLoading = true;
  }

  intoStudyDetail(item){
    this.navCtrl.push('OnlineStudyMainPage',{leac001:item.LEAC001});
  }

}
