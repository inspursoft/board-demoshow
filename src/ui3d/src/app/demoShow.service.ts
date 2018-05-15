import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/fromEvent';

export interface IWorkInfo {
  worker_id: string;
  worker_version: string;
  workload: number;
  node_name: string;
}

export interface ISystemInfo {
  time_stamp: number,
  system_version: string,
  sum_workload: number
}

@Injectable()
export class DemoShowService {
  private readonly NUMBER_COLORS: Array<string> = [
    'rgba(255,192,0,1)',
    'rgba(192,0,0,1)',
    'rgba(255,0,0,1)',

    'rgba(255,255,0,1)',
    'rgba(146,208,80,1)',
    'rgba(0,176,80,1)',
    'rgba(0,176,240,1)',
    'rgba(0,32,96,1)',
    'rgba(112,48,160,1)',
    'rgba(91,155,213,1)',
    'rgba(237,125,49,1)',
    'rgba(255,192,0,1)',
    'rgba(68,114,196,1)',
    'rgba(112,173,71,1)',

    'rgba(112,173,71,1)',
    'rgba(112,173,71,1)'];

  constructor(private http: HttpClient) {
  }

  getNumberColor(index: number): string {
    return this.NUMBER_COLORS[index];
  }

  getWorkInfoList(): Observable<Array<IWorkInfo>> {
    return this.http.get<Array<IWorkInfo>>(`/api/v1/workerinfo`);
  }

  getSystemInfo(): Observable<ISystemInfo> {
    return this.http.get<ISystemInfo>(`/api/v1/systeminfo`);
  }


}
