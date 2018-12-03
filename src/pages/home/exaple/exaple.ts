import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExaplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-exaple',
  templateUrl: 'exaple.html',
})
export class ExaplePage {

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams)
  {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExaplePage');
  }


  Boxone(){
    this.navCtrl.push('BoxonePage');
  }

  Boxtwo(){
    this.navCtrl.push('BoxtwoPage');
  }

  Boxthree(){
    this.navCtrl.push('BoxthreePage');
  }

  Boxfour(){
    this.navCtrl.push('BoxfourPage');
  }
  Boxfive(){
    this.navCtrl.push('BoxfivePage');
  }
}
