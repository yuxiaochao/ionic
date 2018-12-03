import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsFriendsPage } from './details-friends';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    DetailsFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsFriendsPage),
    PipesModule
  ],
})
export class DetailsFriendsPageModule {}
