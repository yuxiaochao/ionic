import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ContactGroupGroupphotoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-group-groupphotoes',
  templateUrl: 'contact-group-groupphotoes.html',
})
export class ContactGroupGroupphotoesPage {

  public change="newPhotoes";
  segmentsArray = ['newPhotoes', 'photoes', 'aboutme'];
  segmentModel: string = this.segmentsArray[0];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactGroupGroupphotoesPage');
  }

  swipeEvent(event) {
    //向左滑
    if (event.direction == 2) {
      if (this.segmentsArray.indexOf(this.segmentModel) < 2) {
        this.segmentModel = this.segmentsArray[this.segmentsArray.indexOf(this.segmentModel) + 1];
      }
    }
   //向右滑
    if (event.direction == 4) {
      if (this.segmentsArray.indexOf(this.segmentModel) > 0) {
        this.segmentModel = this.segmentsArray[this.segmentsArray.indexOf(this.segmentModel) - 1];
      }


    }
  }
}
