import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {GlobalData} from "../../../../providers/GlobalData";
import {CommonService} from "../../../../service/CommonService";

/**
 * Generated class for the StandardsTrainListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-standards-train-list',
  templateUrl: 'standards-train-list.html',
})
export class StandardsTrainListPage {

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  @ViewChild(Navbar) navbar : Navbar;

  items : any = [];
  start : number = 1;
  unRecord : boolean = false;
  myInput : string = ''
  constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public commonService : CommonService,
                public globalData : GlobalData) {
  }

  ionViewDidLoad() {
    this.initData();
  }


  initData(){
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
    return this.commonService.getPage('/standardsTrain/list',paramMap);
  }

  //进入达标练习
  intoExamDetail(item){
    this.navCtrl.push('StandardsTrainTestPage',{est001:item.est001})
  }

}
