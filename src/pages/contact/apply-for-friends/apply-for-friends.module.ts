import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyForFriendsPage } from './apply-for-friends';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    ApplyForFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyForFriendsPage),
    PipesModule
  ],
})
export class ApplyForFriendsPageModule {}
