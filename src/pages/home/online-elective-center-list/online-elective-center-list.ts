import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../service/CommonService";
import {GlobalData} from "../../../providers/GlobalData";


/**
 * Generated class for the OnlineElectiveCenterListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-online-elective-center-list',
  templateUrl: 'online-elective-center-list.html',
})
export class OnlineElectiveCenterListPage {
  resources:string='';
  elec:string='';
  cur:string='';
  fitems : any = [];
  sitems : any = [];

  start : number = 1;
  unRecord : boolean = false;
  myInput : string = '';
  menuState : boolean =false;

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll :InfiniteScroll;
  @ViewChild(Navbar) navbar : Navbar;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService : CommonService,
              public globalData : GlobalData) {

  }
  ionViewDidLoad() {
    this.initElectiveList().subscribe(data=>{
      if(data.firstLevelDirectory){
        this.fitems = data.firstLevelDirectory;
        this.resources=this.fitems[0].CATA016;
        this.elec=this.fitems[0].CATA002;

        if(this.fitems[0].secondLevelDirectory){

          this.sitems = this.fitems[0].secondLevelDirectory;
        }else{
          this.unRecord = true;
        }
      }else{
        this.unRecord = true;
      }
    });

    console.log('ionViewDidLoad OnlineElectiveCenterListPage');
  }
  initElectiveList(paramMap?){
    return this.commonService.getPage('/study/levelDirectory',paramMap);
  }
  intoElectiveCentet(item,index){
    for(let i=0;i < this.fitems.length;i++){
      this.fitems[i].cur = 0;
    }
    item.cur = 1;
    this.resources=item.CATA016;
    this.elec=item.CATA002;

    if(this.fitems[index].secondLevelDirectory){

      this.sitems = this.fitems[index].secondLevelDirectory;
    }else{
      this.unRecord = true;
    }
  }
}
