import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CsClockComponent } from './cs-clock/cs-clock.component';
import { CsNumberComponent } from './cs-number/cs-number.component';
import { DemoShowService } from './demoShow.service';
import { HttpClientModule } from '@angular/common/http';
import { CsTitleComponent } from './cs-title/cs-title.component';
import { CsNumberContainerComponent } from './cs-number-container/cs-number-container.component';

@NgModule({
  declarations: [
    AppComponent,
    CsTitleComponent,
    CsNumberComponent,
    CsClockComponent,
    CsNumberContainerComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule
  ],
  entryComponents: [CsNumberComponent,CsNumberContainerComponent],
  providers: [DemoShowService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
