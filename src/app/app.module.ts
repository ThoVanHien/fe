import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AppWildcardRoutingModule } from './app-wildcard-routing.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { NotFoundComponent } from './not-found.component';
import { SharedModule } from './shared';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    AppWildcardRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
