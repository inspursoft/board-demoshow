import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/fromEvent';

export const MAX_NODE_COUNT: number = 20;
export const MAX_LINE_NUMBERS_COUNT: number = 20;
export interface INumber {
  sideLength: number;
  backColor: string;
  fontColor: string;
}
export interface IWorkInfo {
  worker_id: string;
  worker_version: string;
  workload: number;
  node_name:string;
}

export interface INumberColor {
  backColor: string;
  fontColor: string;
}

export interface ISystemInfo {
  time_stamp: number,
  system_version: string,
  sum_workload: number
}

@Injectable()
export class DemoShowService {
  private _numberHeight: number = 150;
  private readonly NUMBER_COLORS: Array<INumberColor> = [
    {backColor: 'rgba(192,0,0,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(255,0,0,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(255,192,0,1)', fontColor: 'rgba(0,0,0,1)'},
    {backColor: 'rgba(255,255,0,1)', fontColor: 'rgba(0,0,0,1)'},
    {backColor: 'rgba(146,208,80,1)', fontColor: 'rgba(0,0,0,1)'},
    {backColor: 'rgba(0,176,80,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(0,176,240,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(0,32,96,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(112,48,160,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(91,155,213,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(237,125,49,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(255,192,0,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(68,114,196,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(112,173,71,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(0,173,71,1)', fontColor: 'rgba(255,255,255,1)'},
    {backColor: 'rgba(112,0,71,1)', fontColor: 'rgba(255,255,255,1)'}
  ];

  constructor(private http: HttpClient) {
  }

  get numberHeight(): number {
    return this._numberHeight;
  }

  getNumberColor(index: number): INumberColor {
    return this.NUMBER_COLORS[index];
  }

  getWorkInfoList(): Observable<Array<IWorkInfo>> {
    return this.http.get<Array<IWorkInfo>>(`/api/v1/workerinfo`)
      .filter((value) => value && value.length > 0);
  }


  getSystemInfo(): Observable<ISystemInfo>{
    return this.http.get<ISystemInfo>(`/api/v1/systeminfo`);
  }
}
