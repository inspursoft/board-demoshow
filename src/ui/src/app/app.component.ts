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

const MAX_NUMBERS_COUNT: number = 8;
const MAX_NUMBERS_COUNT_LINE: number = 4;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  @ViewChild('firstOutLet', {read: ViewContainerRef}) firstOutLet: ViewContainerRef;
  @ViewChild('secondOutLet', {read: ViewContainerRef}) secondOutLet: ViewContainerRef;
  private validNumberComponentList: Map<string, CsNumberComponent>;
  private inValidNumberComponentList: Array<CsNumberComponent>;

  constructor(private demoShowService: DemoShowService,
              private factoryResolver: ComponentFactoryResolver,
              private changeDetectorRef: ChangeDetectorRef) {
    this.validNumberComponentList = new Map<string, CsNumberComponent>();
    this.inValidNumberComponentList = Array<CsNumberComponent>();
  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.demoShowService.getWorkInfoList().subscribe((res: Array<IWorkInfo>) => {
        if (this.validNumberComponentList.size == 0) {
          this.initNumbers(res);
          this.createNoneInfo();
          this.changeDetectorRef.detectChanges();
        } else {
          this.addNewWorkInfo(res);
          this.updateWorkInfo(res);
          this.changeDetectorRef.detectChanges();
        }
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      });
    }, 1000);
  }

  private createNoneInfo() {
    while (this.firstOutLet.length < MAX_NUMBERS_COUNT_LINE) {
      let instance = this.createOneNumberComponent(this.firstOutLet);
      this.inValidNumberComponentList.push(instance);
    }
    while (this.secondOutLet.length < MAX_NUMBERS_COUNT_LINE) {
      let instance = this.createOneNumberComponent(this.secondOutLet);
      this.inValidNumberComponentList.push(instance);
    }
  }

  private inValidNumberComponent(): CsNumberComponent {
    if (this.inValidNumberComponentList.length > 0) {
      return this.inValidNumberComponentList.pop();
    }
  }

  private initNumbers(workInfoList: Array<IWorkInfo>) {
    let container: ViewContainerRef;
    for (let i = 0; i < workInfoList.length; i++) {
      i < MAX_NUMBERS_COUNT_LINE ? container = this.firstOutLet : container = this.secondOutLet;
      let numberComponent = this.createOneNumberComponent(container);
      numberComponent.workInfo = workInfoList[i];
      numberComponent.isValid = true;
      this.validNumberComponentList.set(workInfoList[i].WorkerID, numberComponent);
    }
  }

  private createOneNumberComponent(container: ViewContainerRef): CsNumberComponent {
    let indexBase: number = container === this.firstOutLet ? 0 : MAX_NUMBERS_COUNT_LINE;
    let factory = this.factoryResolver.resolveComponentFactory(CsNumberComponent);
    let numberRef = container.createComponent(factory);
    let numberColor = this.demoShowService.getNumberColor(indexBase + container.length - 1);
    numberRef.instance.backgroundColor = numberColor.backColor;
    numberRef.instance.fontColor = numberColor.fontColor;
    return numberRef.instance;
  }

  private addNewWorkInfo(newWorkInfoList: Array<IWorkInfo>) {
    newWorkInfoList.forEach(value => {
      let notExist = this.validNumberComponentList.get(value.WorkerID) === undefined;
      if (notExist) {
        let inValidComponent = this.inValidNumberComponent();
        if (inValidComponent) {
          inValidComponent.workInfo = value;
          inValidComponent.isValid = true;
          this.validNumberComponentList.set(value.WorkerID, inValidComponent);
        }
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
}
