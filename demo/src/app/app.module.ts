import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { Drupal7ServicesModule, DrupalConstants, Settings } from '../../../index';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Drupal7ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor () {
    const drupalSettings: Settings = {
      apiEndPoint: 'api',
      apiHost: 'localhost',
      apiProtocol: 'http',
      language: 'und',
      requestTimeout: 5000,
    };
    DrupalConstants.Settings = drupalSettings;
  }
}
