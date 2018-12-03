import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CanteenDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-canteen-details',
  templateUrl: 'canteen-details.html',
})
export class CanteenDetailsPage {

  canteen:any=[];
  CANTEEN:any=[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CanteenDetailsPage');
    this.CANTEEN=this.navParams.get('CANTEEN');
    this.canteen=this.CANTEEN[0];
  }

}
