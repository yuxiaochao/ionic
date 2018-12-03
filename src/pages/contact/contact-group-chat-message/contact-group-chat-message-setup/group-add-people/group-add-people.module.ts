import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupAddPeoplePage } from './group-add-people';
import {PipesModule} from "../../../../../pipes/pipes.module";

@NgModule({
  declarations: [
    GroupAddPeoplePage,
  ],
  imports: [
    IonicPageModule.forChild(GroupAddPeoplePage),
    PipesModule
  ],
})
export class GroupAddPeoplePageModule {}
