import { NgModule }      from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MainComponent }   from './main.component';
import { HttpModule } from '@angular/http';
import { KeysPipe } from './keys.pipe';

@NgModule({
  imports:      [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ MainComponent, KeysPipe ],
  bootstrap:    [ MainComponent ]
})

export class AppModule { }
