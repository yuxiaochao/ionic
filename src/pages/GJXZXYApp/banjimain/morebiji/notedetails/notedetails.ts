import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../../service/CommonService";

/**
 * Generated class for the NotedetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notedetails',
  templateUrl: 'notedetails.html',
})
export class NotedetailsPage {

  noteBook:any={};
  deleValue=1;
  //i:number=0;
  toppings:number;
  pictrue:any=[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService:CommonService,
               public alert:AlertController) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotedetailsPage');
    this.noteBook=this.navParams.get("NOTE");

    this.noteBook["PHOTESPATH"]=this.noteBook["PHOTESPATH"].split(",");
  }

  deleteNote(){
    //this.toppings==2 ? this.toppings=1: this.toppings=2

    //let aa=this.toppings;
    let alert=this.alert.create({
      title:'确定要删除吗？',
      buttons:[{
        text:'确定',
        handler:()=>{
          this.commonService.getPage('/huarui/XzxyNoteBook/deleteNoteBook',{
           NOTE001: this.noteBook.NOTE001
          }).auditTime(500).subscribe(data=>{
                  if(data.flage){
                    let alert=this.alert.create({
                      title:'删除成功！',
                      buttons:[{
                        text:'确定',
                        handler:()=>{
                          this.navCtrl.pop();
                        }
                      }]
                    }).present();
                  }else {
                    let alert=this.alert.create({
                      title:'删除失败！请您稍后再试',
                      buttons:[{
                        text:'确定',
                        handler:()=>{

                        }
                      }]
                    }).present();
                  }
          })
        }
      },{
        text:'取消',
        handler:()=>{
          //this.deleValue=1;
        }
      }]
    }).present()


  }

}
