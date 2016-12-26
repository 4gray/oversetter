import { NgModule }      from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MainComponent }   from './main.component';
import { SettingsComponent }   from './settings.component';
import { HomeComponent }   from './home.component';
import { HttpModule } from '@angular/http';
import { KeysPipe } from './keys.pipe';
import { routing } from './app.routes';

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule, routing ],
  declarations: [ HomeComponent, MainComponent, SettingsComponent, KeysPipe ],
  bootstrap:    [ HomeComponent ],
  providers: 	[ { provide: APP_BASE_HREF, useValue: 'main' } ]
})

export class AppModule { }
