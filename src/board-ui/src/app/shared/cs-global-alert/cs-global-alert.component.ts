import { Component } from '@angular/core';
import { GlobalAlertMessage } from '../shared.types';
import { Observable, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './cs-global-alert.component.html',
  styleUrls: ['./cs-global-alert.component.css']
})
export class CsGlobalAlertComponent {
  _isOpen: boolean = false;
  curMessage: GlobalAlertMessage;
  onCloseEvent: Subject<any>;
  detailModalOpen: boolean = false;

  constructor() {
    this.onCloseEvent = new Subject<any>();
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;
    if (!value) {
      this.onCloseEvent.next();
    }
  }

  get errorDetailMsg(): string {
    let result: string = '';
    if (this.curMessage.errorObject && this.curMessage.errorObject instanceof HttpErrorResponse) {
      let err = (this.curMessage.errorObject as HttpErrorResponse).error;
      if (typeof err == "object") {
        result = (this.curMessage.errorObject as HttpErrorResponse).error.message;
      } else {
        result = err;
      }
    } else if (this.curMessage.errorObject) {
      result = (this.curMessage.errorObject as Error).message;
    }
    return result;
  }

  public openAlert(message: GlobalAlertMessage): Observable<any> {
    this.curMessage = message;
    this.isOpen = true;
    return this.onCloseEvent.asObservable();
  }
}
