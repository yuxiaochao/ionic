import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ErlandfriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-erlandfriend',
  templateUrl: 'erlandfriend.html',
})
export class ErlandfriendPage {

  wenjian:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErlandfriendPage');
  }

  addwenjian(){
    if(!this.wenjian){
      this.wenjian=true;
    }else{
      this.wenjian=false;
    }
  }


  tianjiafrd(){
    this.navCtrl.push('AddfriendsqPage');
  }

}
