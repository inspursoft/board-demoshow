import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromEvent';

export interface IWorkInfo {
  WorkerID: string;
  WorkLoad: number;
  WorkVersion: string;
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
    return this.isClick ? Observable.of([
        {WorkerID: 'a', WorkLoad: 32, WorkVersion: '1.0'},
        {WorkerID: 'b', WorkLoad: 33, WorkVersion: '2.0'},
        {WorkerID: 'c', WorkLoad: 44, WorkVersion: '2.0'},
        {WorkerID: 'd', WorkLoad: 55, WorkVersion: '2.0'},
        {WorkerID: 'e', WorkLoad: 66, WorkVersion: '2.0'}
      ]) :
      Observable.of([
        {WorkerID: 'a', WorkLoad: 123, WorkVersion: '1.0'},
        {WorkerID: 'b', WorkLoad: 124, WorkVersion: '2.0'},
        {WorkerID: 'c', WorkLoad: 125, WorkVersion: '2.0'},
        {WorkerID: 'd', WorkLoad: 126, WorkVersion: '2.0'},
        {WorkerID: 'e', WorkLoad: 127, WorkVersion: '2.0'},
        {WorkerID: 'f', WorkLoad: 128, WorkVersion: '1.0'},
        {WorkerID: 'g', WorkLoad: 129, WorkVersion: '2.0'},
        {WorkerID: 'h', WorkLoad: 130, WorkVersion: '2.0'},
        {WorkerID: 'i', WorkLoad: 131, WorkVersion: '2.0'},
        {WorkerID: 'j', WorkLoad: 132, WorkVersion: '2.0'}
      ]);
    // return this.http.get<Array<IWorkInfo>>(`url`);
  }
}
