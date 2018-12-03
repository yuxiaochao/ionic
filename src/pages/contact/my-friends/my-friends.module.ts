import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyFriendsPage } from './my-friends';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MyFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyFriendsPage),
    PipesModule
  ],
})
export class MyFriendsPageModule {}
