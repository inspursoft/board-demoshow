import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DemoShowService } from './demoShow.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    NgxEchartsModule,
    BrowserModule
  ],
  exports: [NgxEchartsModule],
  entryComponents: [],
  providers: [DemoShowService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
