import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";


@IonicPage()
@Component({
  selector: 'page-online-electivecourse-list',
  templateUrl: 'online-electivecourse-list.html',
})
export class OnlineElectivecourseListPage {  //输出 放声明变量


  items: any = [];
  active: string = '';
  item: any = [];
  //selectCourseList: any = [];
  currn: number = 0;
  selectItem: any = [];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public globalData: GlobalData) {


  }


  //当页面加载时调用。


  ionViewDidLoad() {
    console.log('ionViewDidLoad OnlineElectivecourseListPage');


    let par = {
      USER001: this.globalData.userId    //定义par，并向后台传送用户的id；
    }

    this.commonService.getPage('/study/levelDirectory', par).subscribe(data => {
      this.tab1(data.firstLevelDirectory[0]);
    });
    this.levedirectory(par);
  }

  // items一级目录，item是二级目录。
  levedirectory(par) {
    this.commonService.getPage('/study/levelDirectory', par).subscribe(data => {
      this.items = data.firstLevelDirectory;
      this.selectItem = data.firstLevelDirectory;
    });
  }

  tab(params) {
    this.currn = -1;
    //把其他目录置为为被选中状态
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].isCur = 0;
    }
    params.isCur = 1;//选中这个课件目录
    this.item = params;
    // this.commonService.getPage('/study/selectCourseList',{CATA001:params.CATA001}
    //   ).subscribe(data => {
    //     debugger
    //     this.selectCourseList=data.selectCourseList;
    // });
  }

  tab1(params) {
    this.item = params;
    // this.commonService.getPage('/study/selectCourseList',{CATA001:params.CATA001}
    // ).subscribe(data => {
    //   debugger
    //   this.selectCourseList=data.selectCourseList;
    // });
  }


  getItems(ev: any) {

    this.selectItem = this.items;
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.selectItem = this.selectItem.filter((item) => {
        return (item.CATA002.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.selectItem[0].isCur = 0;
      this.item = this.selectItem[0];
    }
  }

  intoAllcourseListPage() {
    this.navCtrl.push('OnlineAllcourseListPage');
  }


}
