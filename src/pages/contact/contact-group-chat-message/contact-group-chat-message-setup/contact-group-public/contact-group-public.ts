import { Component } from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AddpublicPage} from "./addpublic/addpublic";
import {CommonService} from "../../../../../service/CommonService";
import {GlobalData} from "../../../../../providers/GlobalData";
import {AboutpublicPage} from "./aboutpublic/aboutpublic";

/**
 * Generated class for the ContactGroupPublicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-group-public',
  templateUrl: 'contact-group-public.html',
})
export class ContactGroupPublicPage {

  GROU001= "";
  items : any = [];
  flagClick =true;
  timeout : number;
  item : any={};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public alertCtrl:AlertController,
              public globaData:GlobalData,
              public actionSheetCtr: ActionSheetController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactGroupPublicPage');
    this.GROU001=this.navParams.get("GROU001"); //群组ID
    this.initData(this.GROU001);
  }
  ionViewDidEnter(){
    /*console.log("ionViewDidEnter(2)");
    this.GROU001=this.navParams.get("GROU001"); //群组ID*/
    this.initData(this.GROU001);

  }


  initData(GROU001){
     this.initInfo({GROU001:this.GROU001}).subscribe(data=>{
       if(data.noticeList && data.noticeList.length>=1){
          this.items=data.noticeList;
       }
     })

  }

  initInfo(paramMap?){
    return this.commonService.getPage("/cts/groups/queryNotice",paramMap)
  }

  //添加公告
  addpublic(){
     let flage=0;
     this.navCtrl.push('AddpublicPage',{GROU001:this.GROU001,FLAGE:flage});
  }

  //修改群公告
  /*changePublic(item){
      let  flage= 1;
      this.navCtrl.push('AddpublicPage',{ITEMS:item,FLAGE:flage});
  }*/

  changePublic(item){

    let actionSheet=this.actionSheetCtr.create({
      title:'请选择',
      buttons:[
        {
          text:'置顶',
          role:'zhiDing',
          handler:()=>{
            this.commonService.getPage('/cts/groups/supportNotice',{
              USER001:this.globaData.userId,
              NOT001:item.NOT001,
            }).subscribe(data=>{
              let succ=data.success
              if(succ==1 || succ=="1"){
                       this.initData(this.GROU001);
              }
            })
          }
        },
        {
          text:'详情',
          role:'about',
          handler:()=>{
            this.navCtrl.push("AboutpublicPage",{ITEM:item});
          }
         },
        {
          text:'修改',
          role:'change',
          handler:()=>{
            let  flage= 1;
            this.navCtrl.push('AddpublicPage',{ITEMS:item,FLAGE:flage});

          }

        },
        {
          text:'删除',
          role:'delete',
          handler:()=>{
            this.globaData.showLoading = false;
            let alert = this.alertCtrl.create({
              title: '确定要删除吗？',
              buttons: [
                {
                  text: '取消',
                  handler: data => {
                  }
                },
                {
                  text: '确定',
                  handler: data => {
                    this.commonService.getPage('/cts/groups/deleteNotice',{
                      USER001:this.globaData.userId,
                      NOT001:item.NOT001,
                     }).auditTime(500).subscribe(data=>{
                      let succ=data.success
                      if(succ==1 || succ=="1"){
                        this.initData(this.GROU001);
                      }
                    })
                  }
                },]
            });
            alert.present();
          }

        },
        {
          text:'取消',
          role:'cancel',
          handler:()=>{

          }
        }
        ]
    });
    actionSheet.present().then(value => {
      return value;
    });

  }

  //删除公告
 /* deletePublic(item){
    this.globaData.showLoading = false;
    let alert = this.alertCtrl.create({
      title: '确定要删除吗？',
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        },
        {
          text: '确定',
          handler: data => {
            this.commonService.getPage('/cts/groups/deleteNotice',{
              USER001:this.globaData.userId,
              NOT001:item.NOT001,
            }).auditTime(500).subscribe(data=>{
              let succ=data.success
              if(succ==1 || succ=="1"){
                this.navCtrl.pop();
              }
            })
          }
        }]
    });
    alert.present();

  }*/

 // 置顶
  /*firstPublic(item){
    this.commonService.getPage('/cts/groups/supportNotice',{
      USER001:this.globaData.userId,
      NOT001:item.NOT001,
      }).subscribe(data=>{
      let succ=data.success
      if(succ==1 || succ=="1"){
        this.navCtrl.pop();
      }
    })

    }*/

  /*//公告详情
  aboutPublic(item){
     this.navCtrl.push("AboutpublicPage",{ITEM:item})
  }*/

  /*downTime(){
    this.timeout=setTimeout(any=>{
      this.flagClick=false;
      console.log("长按")
    },2000)
    }

  upTime(){
    if( this.flagClick){
     clearTimeout(this.timeout)
     console.log("单机")
    }
    this.flagClick=true;
  }
*/


}
