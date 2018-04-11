import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DemoShowService, IWorkInfo } from './demoShow.service';
import { CsNumberComponent } from './cs-number/cs-number.component';
import { HttpErrorResponse } from '@angular/common/http';

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
  validNumberComponentList: Map<number, CsNumberComponent>;

  constructor(private demoShowService: DemoShowService,
              private factoryResolver: ComponentFactoryResolver,
              private changeDetectorRef: ChangeDetectorRef) {
    this.validNumberComponentList = new Map<number, CsNumberComponent>();
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.demoShowService.getWorkInfoList().subscribe((res: Array<IWorkInfo>) => {
        this.activeInstanceCount = res.length;
        if (this.validNumberComponentList.size == 0) {
          this.initNumbers(res);
          this.changeDetectorRef.detectChanges();
        } else {
          this.addNewWorkInfo(res);
          this.checkDeleteInfo(res);
          this.updateWorkInfo(res);
          this.isHaveMoreNumber = res.length > this.numbersOutLet.length;
          this.changeDetectorRef.detectChanges();
        }
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      });
    }, 1500);
  }

  get containerWidth():string{
    return `${(MAX_LINE_NUMBERS_COUNT * (this.demoShowService.numberHeight + 35))}px`;
  }

  get deadInstanceCount():number{
    let r = 0;
    this.validNumberComponentList.forEach((value:CsNumberComponent) => {
      if (!value.isValid){
        r++;
      }
    });
    return r;
  };

  get sleepInstanceCount():number{
    let r = 0;
    this.validNumberComponentList.forEach((value:CsNumberComponent) => {
      if (!value.isRun){
        r++;
      }
    });
    return r;
  }

  get totalInstanceCount():number{
    return this.deadInstanceCount + this.activeInstanceCount + this.sleepInstanceCount;
  }

  private initNumbers(workInfoList: Array<IWorkInfo>) {
    for (let i = 0; i < workInfoList.length && i < MAX_NUMBERS_COUNT * this.numTimes; i++) {
      let numberComponent = this.createOneNumberComponent();
      numberComponent.workInfo = workInfoList[i];
      numberComponent.isValid = true;
      this.validNumberComponentList.set(workInfoList[i].WorkerID, numberComponent);
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
      let notExist = this.validNumberComponentList.get(value.WorkerID) === undefined;
      if (notExist && this.numbersOutLet.length < MAX_NUMBERS_COUNT * this.numTimes) {
        let inValidComponent = this.createOneNumberComponent();
        inValidComponent.workInfo = value;
        inValidComponent.isValid = true;
        this.validNumberComponentList.set(value.WorkerID, inValidComponent);
      }
    });
  }

  private updateWorkInfo(newWorkInfoList: Array<IWorkInfo>) {
    newWorkInfoList.forEach(value => {
      let instance = this.validNumberComponentList.get(value.WorkerID);
      if (instance) {
        instance.workInfo = value;
      }
    });
  }

  private checkDeleteInfo(newWorkInfoList: Array<IWorkInfo>) {
    this.validNumberComponentList.forEach((component: CsNumberComponent, key: number) => {
      if (newWorkInfoList.find((workInfo: IWorkInfo) => workInfo.WorkerID == key) == undefined) {
        component.isValid = false;
      }
    });
  }
}
