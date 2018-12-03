import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PipesModule} from "../../../../pipes/pipes.module";
import {UserListPage} from "./user-list";

@NgModule({
  declarations: [
    UserListPage,
  ],
  imports: [
    IonicPageModule.forChild(UserListPage),
    PipesModule
  ],
})
export class UserListPageModule {}
