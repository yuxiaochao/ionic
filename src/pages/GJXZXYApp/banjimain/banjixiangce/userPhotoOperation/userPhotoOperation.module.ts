import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPhotoOperationPage } from './userPhotoOperation';
import {PipesModule} from "../../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    UserPhotoOperationPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPhotoOperationPage),
    PipesModule
  ],
})
export class UserPhotoOperationPageModule {}
