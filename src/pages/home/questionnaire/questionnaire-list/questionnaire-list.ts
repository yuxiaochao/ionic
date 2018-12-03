import {Component, ViewChild} from '@angular/core';
import {Content, InfiniteScroll, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {CommonService} from "../../../../service/CommonService";
import {GlobalData} from "../../../../providers/GlobalData";
import {QuestionnaireTestPage} from "../questionnaire-test/questionnaire-test";


/**
 * Generated class for the QuestionnaireListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-questionnaire-list',
  templateUrl: 'questionnaire-list.html',
})
export class QuestionnaireListPage {

  items: any = [];
  start: number = 1;
  unRecord: boolean = false;
  myInput: string = '';

  @ViewChild(Content) content: Content;
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Navbar) navbar: Navbar;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public commonService: CommonService,
              public globalData: GlobalData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionnaireListPage');
    this.initData();
  }

  initData() {
    return new Promise((resolve) => {
      this.content.scrollToTop(0);
      this.unRecord = false;
      this.start = 1;
      this.infiniteScroll.enable(true);
      this.initOnlineList({START: 1, USER001: this.globalData.userId}).subscribe(data => {
        if (data.researchListPage && data.researchListPage.length >= 1) {
          this.items = data.researchListPage;
        } else {
          this.unRecord = true;
        }
        resolve();
      });
    });
  }

  /**
   * 获取调查问卷列表（默认加载10条）
   */
  initOnlineList(paramMap?) {
    return this.commonService.getPage('/research/queryResearchList', paramMap);
  }

  /**
   * 跳转调查试题页面
   */
  intoQuestionnaireDetail(paramMap) {
    this.navCtrl.push('QuestionnaireTestPage', {
      QUES001: paramMap.QUES001,
      QUES009: paramMap.QUES009
    });
  }

  //下拉刷新
  doRefresh(refresher) {
    this.initData().then(() => {
      refresher.complete();
    });
  }

  doInfinite(infiniteScroll) {
    this.globalData.showLoading = false;
    this.initOnlineList({START: ++this.start, USER001: this.globalData.userId})
      .auditTime(500)
      .subscribe(data => {
        if (data.researchListPage.length > 0) {
          this.items = this.items.concat(data.researchListPage);
        } else {
          infiniteScroll.enable(false);
        }
        infiniteScroll.complete();

      })
    this.globalData.showLoading = true;
  }

}
