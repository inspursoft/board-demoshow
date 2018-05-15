import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { DemoShowService, ISystemInfo, IWorkInfo, MAX_NODE_COUNT } from './demoShow.service';
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
import { CsNumberContainerComponent } from './cs-number-container/cs-number-container.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  @ViewChild('containersOutLet', {read: ViewContainerRef}) containersOutLet: ViewContainerRef;
  activeInstanceCount: number = 0;
  totalExistenceTime: string;
  systemInfoStr: string;
  workLoadSum: number;
  nodeNames: Set<string>;
  containerIndex: number = 0;
  containerList: Map<string, CsNumberContainerComponent>;

  constructor(private demoShowService: DemoShowService,
              private factoryResolver: ComponentFactoryResolver,
              private changeDetectorRef: ChangeDetectorRef) {
    this.containerList = new Map<string, CsNumberContainerComponent>();
    this.nodeNames = new Set<string>();
  }

  ngAfterViewInit(): void {
    Observable.interval(1500).subscribe(() => this.updateData());
  }

  get deadInstanceCount(): number {
    let r = 0;
    this.containerList.forEach(value => r += value.deadInstanceCount);
    return r;
  };

  get sleepInstanceCount(): number {
    let r = 0;
    this.containerList.forEach(value => r += value.sleepInstanceCount);
    return r;
  }

  get totalInstanceCount(): number {
    return this.deadInstanceCount + this.activeInstanceCount + this.sleepInstanceCount;
  }

  public updateData() {
    let obs1 = this.demoShowService.getWorkInfoList()
      .do((res: Array<IWorkInfo>) => {
        this.activeInstanceCount = res.length;
        if (this.nodeNames.size == 0) {
          this.initNodeNames(res);
          this.initNumberContainers();
          this.initNumbers(res);
        } else {
          this.addNewNodeName(res);
          this.addNewContainer();
          this.addNewWorkInfo(res);
          this.checkDeleteInfo(res);
          this.updateWorkInfo(res);
        }
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
      });
    let obs2 = this.demoShowService.getSystemInfo()
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

    /**forkJoin虽然是Promise.all，但这里的obs1和obs2都没有完成，总是在请求，所以它不适合实时的访问，适合一次性的；
     * Observable.forkJoin(obs1,obs2).subscribe(() => this.changeDetectorRef.detectChanges());*/
  }

  private initNumbers(workInfoList: Array<IWorkInfo>) {
    workInfoList.forEach(value => {
      let container: CsNumberContainerComponent = this.containerList.get(value.node_name);
      if (container){
        container.createOneNumberComponent(value);
      }
    });
  }

  private initNumberContainers() {
    this.nodeNames.forEach(value => this.createOneNumberContainer(value));
  }

  private initNodeNames(workInfoList: Array<IWorkInfo>) {
    workInfoList.forEach(value => {
      if (this.nodeNames.size < MAX_NODE_COUNT) {
        this.nodeNames.add(value.node_name);
      }
    });
  }

  private createOneNumberContainer(nodeName: string): CsNumberContainerComponent {
    let factory = this.factoryResolver.resolveComponentFactory(CsNumberContainerComponent);
    let containerRef = this.containersOutLet.createComponent(factory);
    containerRef.instance.containerIndex = this.containerIndex;
    containerRef.instance.nodeName = nodeName;
    this.containerIndex++;
    this.containerList.set(nodeName, containerRef.instance);
    return containerRef.instance;
  }

  addNewNodeName(newWorkInfoList: Array<IWorkInfo>): void {
    newWorkInfoList.forEach(value => {
      if (this.nodeNames.size < MAX_NODE_COUNT && !this.nodeNames.has(value.node_name)) {
        this.nodeNames.add(value.node_name);
      }
    });
  }

  addNewContainer(): void {
    this.nodeNames.forEach(value => {
      if (!this.containerList.has(value)) {
        this.createOneNumberContainer(value);
      }
    });
  }

  private addNewWorkInfo(newWorkInfoList: Array<IWorkInfo>) {
    newWorkInfoList.forEach(workInfo => {
      let container = this.containerList.get(workInfo.node_name);
      if (container && !container.hasWorkInfo(workInfo.worker_id)) {
        container.createOneNumberComponent(workInfo);
      }
    });
  }

  private updateWorkInfo(newWorkInfoList: Array<IWorkInfo>) {
    this.containerList.forEach(value => {
      value.updateWorkInfo(newWorkInfoList);
    });
  }

  private checkDeleteInfo(newWorkInfoList: Array<IWorkInfo>) {
    this.containerList.forEach(value => {
      value.checkDeleteInfo(newWorkInfoList);
    });
  }
}
