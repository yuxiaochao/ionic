import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PipesModule} from "../../../../pipes/pipes.module";
import {AllUserGroupPage} from "./all-user-group";

@NgModule({
  declarations: [
    AllUserGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(AllUserGroupPage),
    PipesModule
  ],
})
export class AllUserGroupPageModule {}
