import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ExportModule } from '../../../index';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ExportModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
