import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactGroupPublicPage } from './contact-group-public';

@NgModule({
  declarations: [
    ContactGroupPublicPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactGroupPublicPage),
  ],
})
export class ContactGroupPublicPageModule {}
