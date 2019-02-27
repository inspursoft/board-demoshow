import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NUMBER_COLORS} from './shared.const';
import {INumberColor, ISystemInfo, IWorkInfo} from './shared.types';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SharedService {
  constructor(private http: HttpClient) {

  }

  getNumberColor(index: number): INumberColor {
    return NUMBER_COLORS[index];
  }

  getWorkInfoList(): Observable<Array<IWorkInfo>> {
    return this.http.get<Array<IWorkInfo>>(`/api/v1/workerinfo`)
      .pipe(filter((value) => value && value.length > 0));
  }

  getSystemInfo(): Observable<ISystemInfo> {
    return this.http.get<ISystemInfo>(`/api/v1/systeminfo`);
  }
}
