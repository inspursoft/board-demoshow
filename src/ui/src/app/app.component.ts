import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DemoShowService, ISystemInfo, IWorkInfo } from './demoShow.service';
import { CsNumberComponent } from './cs-number/cs-number.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concat';

const MAX_NUMBERS_COUNT: number = 10;
const MAX_LINE_NUMBERS_COUNT: number = 5;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  @ViewChild('numbersOutLet', {read: ViewContainerRef}) numbersOutLet: ViewContainerRef;
  numTimes: number = 1;
  activeInstanceCount: number = 0;
  isHaveMoreNumber: boolean = false;
  validNumberComponentList: Map<string, CsNumberComponent>;
  totalExistenceTime: string;
  systemInfoStr: string;
  workLoadSum: number;

  constructor(private demoShowService: DemoShowService,
              private factoryResolver: ComponentFactoryResolver,
              private changeDetectorRef: ChangeDetectorRef) {
    this.validNumberComponentList = new Map<string, CsNumberComponent>();
  }

  ngAfterViewInit(): void {
    this.updateData();
  }

  get containerWidth(): string {
    return `${(MAX_LINE_NUMBERS_COUNT * (this.demoShowService.numberHeight + 35))}px`;
  }

  get deadInstanceCount(): number {
    let r = 0;
    this.validNumberComponentList.forEach((value: CsNumberComponent) => {
      if (!value.isValid) {
        r++;
      }
    });
    return r;
  };

  get sleepInstanceCount(): number {
    let r = 0;
    this.validNumberComponentList.forEach((value: CsNumberComponent) => {
      if (!value.isRun) {
        r++;
      }
    });
    return r;
  }

  get totalInstanceCount(): number {
    return this.deadInstanceCount + this.activeInstanceCount + this.sleepInstanceCount;
  }

  private updateData() {
    let obs1 = Observable.interval(1500)
      .switchMap(() => this.demoShowService.getWorkInfoList())
      .do((res: Array<IWorkInfo>) => {
        this.activeInstanceCount = res.length;
        if (this.validNumberComponentList.size == 0) {
          this.initNumbers(res);
        } else {
          this.addNewWorkInfo(res);
          this.checkDeleteInfo(res);
          this.updateWorkInfo(res);
          this.isHaveMoreNumber = res.length > this.numbersOutLet.length;
        }
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      });
    let obs2 = Observable.interval(1500)
      .switchMap(() => this.demoShowService.getSystemInfo())
      .do((res: ISystemInfo) => {
        let nowSeconds = Math.round(new Date().getTime() / 1000);
        let restSeconds = nowSeconds - res.time_stamp;
        let days = Math.floor(restSeconds / (60 * 60 * 24));
        restSeconds -= days * 60 * 60 * 24;
        let hours = Math.floor(restSeconds / (60 * 60));
        restSeconds -= hours * 60 * 60;
        let minutes = Math.floor(restSeconds / 60);
        restSeconds -= minutes * 60;
        this.totalExistenceTime = `(${days})days,${hours}:${minutes}:${restSeconds}`;
        this.systemInfoStr = res.system_version;
        this.workLoadSum = res.sum_workload;
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      });
    /**一直等到所有 observables 都发出一个值，才将所有值作为数组发出*/
    Observable.zip(obs1, obs2).subscribe(() => this.changeDetectorRef.detectChanges());
    /**obs1.merge(obs2).bufferCount(2).subscribe(() => this.changeDetectorRef.detectChanges());*/
  }

  private initNumbers(workInfoList: Array<IWorkInfo>) {
    for (let i = 0; i < workInfoList.length && i < MAX_NUMBERS_COUNT * this.numTimes; i++) {
      let numberComponent = this.createOneNumberComponent();
      numberComponent.workInfo = workInfoList[i];
      numberComponent.isValid = true;
      this.validNumberComponentList.set(workInfoList[i].worker_id, numberComponent);
    }
  }

  private createOneNumberComponent(): CsNumberComponent {
    let factory = this.factoryResolver.resolveComponentFactory(CsNumberComponent);
    let numberRef = this.numbersOutLet.createComponent(factory);
    let numberColor = this.demoShowService.getNumberColor(this.numbersOutLet.length - 1);
    numberRef.instance.sideLength = this.demoShowService.numberHeight;
    numberRef.instance.backgroundColor = numberColor.backColor;
    numberRef.instance.fontColor = numberColor.fontColor;
    return numberRef.instance;
  }

  private addNewWorkInfo(newWorkInfoList: Array<IWorkInfo>) {
    newWorkInfoList.forEach(value => {
      let notExist = this.validNumberComponentList.get(value.worker_id) === undefined;
      if (notExist && this.numbersOutLet.length < MAX_NUMBERS_COUNT * this.numTimes) {
        let inValidComponent = this.createOneNumberComponent();
        inValidComponent.workInfo = value;
        inValidComponent.isValid = true;
        this.validNumberComponentList.set(value.worker_id, inValidComponent);
      }
    });
  }

  private updateWorkInfo(newWorkInfoList: Array<IWorkInfo>) {
    newWorkInfoList.forEach(value => {
      let instance = this.validNumberComponentList.get(value.worker_id);
      if (instance) {
        instance.workInfo = value;
      }
    });
  }

  private checkDeleteInfo(newWorkInfoList: Array<IWorkInfo>) {
    this.validNumberComponentList.forEach((component: CsNumberComponent, key: string) => {
      if (newWorkInfoList.find((workInfo: IWorkInfo) => workInfo.worker_id == key) == undefined) {
        component.isValid = false;
      }
    });
  }
}
