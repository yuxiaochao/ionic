import {Component, ElementRef, Renderer2} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-questionnaire-more-popover',
  templateUrl: 'questionnaire-more-popover.html',
})
export class QuestionnaireMorePopoverPage {
  background: string;
  contentEle: any;
  textEle: any;
  headerEle: any;
  isSpecial: string = "default";
  day: string = "sunny";
  addMoonClass: any;
  moonClass: boolean;
  fontSize = {
    smaller: '14px',
    default: '16px',
    larger: '18px'
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public renderer: Renderer2,
              public storage: Storage,
              public ementRef: ElementRef) {
  }

  ionViewDidLoad() {
    if (this.navParams.data) {
      this.contentEle = this.navParams.data.contentEle;
      this.textEle = this.navParams.data.textEle;
      this.headerEle = this.navParams.data.headerEle;
      this.addMoonClass = this.navParams.data.addMoonClass;
    }
    this.storage.get('test_seeting').then(data => {
      if (data && data.nightModel) {
        this.day = 'moon';
        this.changeBackground(this.day);
      }

      if (data && data.fontSize) {
        this.isSpecial = data.fontSize;
      }
    })
  }

  changeFontSize(direction) {
    if (direction == 'smaller') {
      this.isSpecial = "smaller";
    } else if (direction == 'larger') {
      this.isSpecial = "larger";
    } else {
      this.isSpecial = "default";
    }
    this.textEle.style.fontSize = this.fontSize[direction];
    this.storage.get('test_seeting').then(data => {
      let obj = data || {};
      obj.fontSize = direction;
      this.storage.set("test_seeting", obj);
    });
  }

  changeBackground(day) {
    let morePopover = this.ementRef.nativeElement.ownerDocument.querySelector('.morePopover');
    if (day == 'moon') {
      this.storage.get('test_seeting').then(data => {
        let obj = data || {};
        obj.nightModel = true;
        this.storage.set("test_seeting", obj);
      });
      this.addMoonClass(true);
      this.moonClass = true;
      morePopover.querySelector('.popover-content').style.backgroundColor = "#253646";
      this.renderer.addClass(morePopover.querySelector('.popover-arrow'), "popover-arrow_sup");

    } else {
      this.storage.get('test_seeting').then(data => {
        let obj = data || {};
        obj.nightModel = false;
        this.storage.set("test_seeting", obj);
      });
      this.addMoonClass(false);
      this.moonClass = false;
      morePopover.querySelector('.popover-content').style.backgroundColor = "#fff";
      this.renderer.removeClass(morePopover.querySelector('.popover-arrow'), "popover-arrow_sup");
    }
  }

}
