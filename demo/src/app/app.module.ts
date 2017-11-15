import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ExportAsModule } from '../../../index';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExportAsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
