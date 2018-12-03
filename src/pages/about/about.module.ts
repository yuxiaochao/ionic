import { IonicPageModule } from "ionic-angular";
import { NgModule } from "@angular/core";
import { AboutPage } from "./about";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [AboutPage],
  imports : [IonicPageModule.forChild(AboutPage),
    PipesModule
  ],
  providers : [],
  entryComponents : [AboutPage]
})
export class AboutModule{

}
