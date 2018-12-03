import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {WorkHomePage} from "../work/work-home";
import {TongxunlumainPage} from "../GJXZXYApp/tongxunlumain/tongxunlumain";

@IonicPage()
@Component({
  selector: 'tabs-page',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  xiaoxiRoot = 'MessagePage';
  banjiRoot = 'BanjimainPage';
  XZtongxunluRoot = 'TongxunlumainPage';
  wodeRoot = 'WodemainPage';

  constructor() {
  }
}
