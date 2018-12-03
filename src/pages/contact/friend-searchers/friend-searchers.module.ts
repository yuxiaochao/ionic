import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendSearchersPage } from './friend-searchers';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    FriendSearchersPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendSearchersPage),
    PipesModule
  ],
})
export class FriendSearchersPageModule {}
