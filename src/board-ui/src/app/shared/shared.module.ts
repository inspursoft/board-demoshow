import {NgModule} from '@angular/core';
import {CsAlertComponent} from './cs-alert/cs-alert.component';
import {CsDialogComponent} from './cs-dialog/cs-dialog.component';
import {CsGlobalAlertComponent} from './cs-global-alert/cs-global-alert.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {ClarityModule} from '@clr/angular';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CsWorkerContainerComponent} from './cs-worker-container/cs-worker-container.component';

@NgModule({
  imports:[
    CommonModule,
    HttpClientModule,
    BrowserModule,
    ClarityModule,
    FormsModule,
  ],
  declarations: [
    CsAlertComponent,
    CsDialogComponent,
    CsGlobalAlertComponent,
    CsWorkerContainerComponent
  ],
  entryComponents: [
    CsAlertComponent,
    CsDialogComponent,
    CsGlobalAlertComponent
  ],
  exports: [
    CsAlertComponent,
    CsDialogComponent,
    CsGlobalAlertComponent,
    CsWorkerContainerComponent,
  ]
})
export class SharedModule {

}
