import {HttpErrorResponse, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {HttpHandler} from '@angular/common/http/src/backend';
import {HttpEvent} from '@angular/common/http/src/response';
import {Injectable} from '@angular/core';
import {MessageService} from '../message-service/message.service';
import {GlobalAlertType} from '../shared.types';
import {catchError, timeout} from 'rxjs/operators';
import {Observable, of, throwError, TimeoutError} from 'rxjs';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq: HttpRequest<any> = req.clone({
      headers: req.headers
    });
    authReq = authReq.clone({
      params: authReq.params.set('Timestamp', Date.now().toString())
    });
    return next.handle(authReq).pipe(
      timeout(30000),
      catchError((err: HttpErrorResponse | TimeoutError) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status >= 200 && err.status < 300) {
            const res = new HttpResponse({
              body: null,
              headers: err.headers,
              status: err.status,
              statusText: err.statusText,
              url: err.url
            });
            return of(res);
          } else if (err.status == 502) {
            this.messageService.showGlobalMessage('网关或代理错误:502', {
              globalAlertType: GlobalAlertType.gatShowDetail,
              errorObject: err
            });
          } else if (err.status == 504) {
            this.messageService.showGlobalMessage('网关超时:504', {
              globalAlertType: GlobalAlertType.gatShowDetail,
              errorObject: err
            });
          } else if (err.status == 500) {
            this.messageService.showGlobalMessage('内部错误:500', {
              globalAlertType: GlobalAlertType.gatShowDetail,
              errorObject: err
            });
          } else if (err.status == 400) {
            this.messageService.showGlobalMessage(`错误请求:400:${authReq.url}`, {
              globalAlertType: GlobalAlertType.gatShowDetail,
              errorObject: err
            });
          } else if (err.status == 403) {
            this.messageService.showAlert(`您没有足够的权限进行该操作:403`, {alertType: 'alert-danger'});
          } else if (err.status == 404) {
            this.messageService.showAlert(`资源未找到:404`, {alertType: 'alert-danger'});
          } else if (err.status == 412) {
            this.messageService.showAlert(`请求内容不满足应提供的前置条件:412`, {alertType: 'alert-warning'});
          } else {
            this.messageService.showGlobalMessage(`未知错误:${err.status}`, {
              globalAlertType: GlobalAlertType.gatShowDetail,
              errorObject: err
            });
          }
        } else {
          this.messageService.showGlobalMessage(`Http请求超时:${authReq.url}`, {
            globalAlertType: GlobalAlertType.gatShowDetail,
            errorObject: err,
            endMessage: req.url
          });
        }
        return throwError(err);
      })
    );
  }
}
