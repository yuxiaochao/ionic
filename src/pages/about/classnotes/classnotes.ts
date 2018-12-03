import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";

/**
 * Generated class for the ClassnotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-classnotes',
  templateUrl: 'classnotes.html',
})
export class ClassnotesPage {

  items: any = [];
  start : number = 1;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public globaDate: GlobalData
              ) {
  }

  ionViewDidLoad() {
    this.initDate();
  }

  initDate() {
    this.initInfo().subscribe(data=>{
      if(data.noteList && data.noteList.length >= 1){
        this.items = data.noteList;
      }
    });

  }

  initInfo(paramMap?) {

   return this.commonService.getPage('/note/noteList', paramMap);
  }

  //加载
  doInfinite(infiniteScroll){
        this.globaDate.showLoading=false;
        this.initInfo({START:++this.start}).auditTime(500).subscribe(data=>{
          if(data.noteList && data.noteList.length>=1){
               this.items=this.items.concat(data.noteList);

          }else{
            infiniteScroll.enable(false);
          }
          infiniteScroll.complete();
        })

  }


  //我的笔记
  myNotes(){
       this.navCtrl.push('ClassnotesMyNotesPage');

  }

  //共享笔记
  shareNote(){

  }
}

