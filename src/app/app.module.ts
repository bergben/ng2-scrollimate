import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Ng2ScrollimateModule } from 'ng2-scrollimate'; // <-- import the module

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Ng2ScrollimateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
