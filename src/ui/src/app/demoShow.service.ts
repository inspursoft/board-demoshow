import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';

export interface IWorkInfo {
  WorkerID: number;
  WorkLoad: number;
}

export interface INumberColor {
  backColor: string;
  fontColor: string;
}

@Injectable()
export class DemoShowService {
  private isClick: boolean = true;
  private readonly NUMBER_COLORS: Array<INumberColor> = [
    {backColor: 'rgba(255,0,0,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(255,255,0,1)', fontColor: 'rgba(0,0,0,1)'},
    {backColor: 'rgba(0,255,255,1)', fontColor: 'rgba(0,0,0,1)'},
    {backColor: 'rgba(0,0,255,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(255,0,255,1)', fontColor: 'rgba(0,0,0,1)'},
    {backColor: 'rgba(0,125,125,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(125,125,125,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(125,0,125,1)', fontColor: 'rgba(255,255,255,1)'}
  ];

  constructor(private http: HttpClient) {
    Observable.fromEvent(document, 'click').subscribe(() => {
      this.isClick = !this.isClick;
    });
  }

  getNumberColor(index: number): INumberColor {
    return this.NUMBER_COLORS[index];
  }

  getWorkInfoList(): Observable<Array<IWorkInfo>> {
    return this.http.get(`/api/v1/workerinfo`)
      .map((res:Object) => {
        let result = Array<IWorkInfo>();
        Object.keys(res).forEach((key:string) =>{
          result.push({WorkerID: Number(key), WorkLoad: res[key]});
        });
        return result;
      });
  }
}
