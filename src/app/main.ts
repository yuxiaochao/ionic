import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import zh from '@angular/common/locales/zh';
import { AppModule } from './app.module';
import {registerLocaleData} from "@angular/common";

platformBrowserDynamic().bootstrapModule(AppModule);
registerLocaleData(zh);
