import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DemoShowService, IWorkInfo, MAX_LINE_NUMBERS_COUNT, MAX_NODE_COUNT } from '../demoShow.service';
import { CsNumberComponent } from '../cs-number/cs-number.component';

@Component({
  selector: 'app-cs-number-container',
  template: '<div style="display: flex;width: 100%;margin-left: 400px;">' +
  '<span style="min-width: 120px">{{nodeName}}</span>' +
  '<ng-template #childContainer></ng-template></div>'
})
export class CsNumberContainerComponent implements OnInit {
  @ViewChild("childContainer", {read: ViewContainerRef}) childContainer:ViewContainerRef;
  containerIndex: number = 0;
  nodeName: string = '';
  childComponents: Array<CsNumberComponent>;

  constructor(private factoryResolver: ComponentFactoryResolver,
              private demoShowService: DemoShowService) {
    this.childComponents = Array<CsNumberComponent>();
  }

  ngOnInit() {
  }

  hasWorkInfo(workID: string): boolean {
    return this.childComponents.find(value => value.workInfo.worker_id == workID) != undefined;
  }

  createOneNumberComponent(workInfo: IWorkInfo): CsNumberComponent {
    if (this.childComponents.length < MAX_LINE_NUMBERS_COUNT) {
      let factory = this.factoryResolver.resolveComponentFactory(CsNumberComponent);
      let numberRef = this.childContainer.createComponent(factory);
      let numberColor = this.demoShowService.getNumberColor(Number(workInfo.worker_id) % 16);
      numberRef.instance.sideLength = this.demoShowService.numberHeight;
      numberRef.instance.backgroundColor = numberColor.backColor;
      numberRef.instance.fontColor = numberColor.fontColor;
      numberRef.instance.workInfo = workInfo;
      numberRef.instance.isValid = true;
      this.childComponents.push(numberRef.instance);
      return numberRef.instance;
    }
  }

  get deadInstanceCount(): number {
    let r: number = 0;
    this.childComponents.forEach(value => {
      if (!value.isValid) {
        r++;
      }
    });
    return r;
  }

  get activeInstanceCount(): number{
    return this.childComponents.length - this.deadInstanceCount - this.sleepInstanceCount;
  }

  get sleepInstanceCount(): number {
    let r: number = 0;
    this.childComponents.forEach(value => {
      if (!value.isRun) {
        r++;
      }
    });
    return r;
  }

  checkDeleteInfo(workInfoList: Array<IWorkInfo>): void {
    this.childComponents.forEach(value => {
      if (workInfoList.find(workInfo => workInfo.worker_id == value.workInfo.worker_id) == undefined) {
        value.isValid = false;
      }
    });
  }

  updateWorkInfo(workInfoList: Array<IWorkInfo>): void {
    this.childComponents.forEach(value => {
      let workInfo = workInfoList.find(workInfo => workInfo.worker_id == value.workInfo.worker_id);
      if (workInfo) {
        value.workInfo = workInfo;
      }
    });
  }
}
