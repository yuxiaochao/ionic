import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FriendverifyPage} from "./friendverify/friendverify";

/**
 * Generated class for the AddnewfriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addnewfriends',
  templateUrl: 'addnewfriends.html',
})
export class AddnewfriendsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddnewfriendsPage');
  }

  friendverify(){
    this.navCtrl.push('FriendverifyPage');   //好友验证界面
  }

}
