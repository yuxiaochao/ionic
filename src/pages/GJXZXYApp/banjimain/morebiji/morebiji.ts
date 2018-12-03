///<reference path="../../../../../node_modules/@angular/core/src/metadata/di.d.ts"/>
import {Component, ViewChild} from '@angular/core';
import {InfiniteScroll, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NotedetailsPage} from "./notedetails/notedetails";
import {AddbijiPage} from "../addbiji/addbiji";
import {CommonService} from "../../../../service/CommonService";
import { Content } from 'ionic-angular';
import {GlobalData} from "../../../../providers/GlobalData";

/**
 * Generated class for the MorebijiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-morebiji',
  templateUrl: 'morebiji.html',
})

export class MorebijiPage {

  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  @ViewChild(Content) content: Content;

  noteList:any=[];
  myInput='';
  start=1;

  constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public commonService : CommonService,
               public  globalData:GlobalData
              ) {
  }

    ionViewDidEnter() {
    console.log('ionViewDidLoad MorebijiPage');
    this.noteListPage();
  }

  ionFocus(){
    console.log("ionFocus()");
    /* this.navbar.hideBackButton=true;*/
  }

  ionCancel(){
    console.log("ionCancel()");
    /* this.navbar.hideBackButton=false;
     this.initDate();*/
  }

  ionClear(){
    console.log("ionClear()");
    this.noteListPage();
  }

  noteListPage(){
    this.commonService.getPage('/huarui/XzxyNoteBook/findNoteBook',{
      TYPE:1
    }).auditTime(500).subscribe(data=>{
      if(data){
        this.noteList=data.noteList;
      }
    })
  }

  notodetailClick(obj){
    this.navCtrl.push('NotedetailsPage',{NOTE:obj});
  }

  tiaozhuantianjia(){
    this.navCtrl.push('AddbijiPage');
  }

  //返回顶部
  toTop(){
    this.content.scrollToTop();
  }

  //搜索
  ionInput(ev: any){
    if(!ev.target.value){
      return;
    }
    this.infiniteScroll.enable(true);
    this.content.scrollToTop(0);
    this.globalData.showLoading = false;

    this.commonService.getPage('/huarui/XzxyNoteBook/findNoteBook',{
      KEYWORD:ev.target.value,
      TYPE:1
    }).subscribe(data=>{
      if(data.noteList.length>0){
        this.noteList=data.noteList;
      }else{
        this.noteList=[];
      }
    });
    this.globalData.showLoading = true;
  }


  //下滑加载
  // doInfinite(infiniteScroll) {
  //   this.globalData.showLoading = false;
  //
  //   this.commonService.getPage('/huarui/XzxyNoteBook/findNoteBook',{
  //     KEYWORD:this.myInput,
  //     START:++this.start,
  //     TYPE:1
  //   }).auditTime(500).subscribe(data=>{
  //
  //     if(data.noteList.length > 0){
  //       this.noteList = this.noteList.concat(data.noteList);
  //     }else{
  //       infiniteScroll.enable(false);
  //     }
  //     infiniteScroll.complete();
  //   });
  //   this.globalData.showLoading = true;
  // }

}
