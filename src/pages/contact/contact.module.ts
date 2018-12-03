import {IonicPageModule} from "ionic-angular";
import {NgModule} from "@angular/core";
import {ContactPage} from "./contact";
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
  declarations: [ContactPage],
  imports : [
    IonicPageModule.forChild(ContactPage),
    PipesModule
  ],
  entryComponents : [ContactPage]
})
export class ContactModule{

}
