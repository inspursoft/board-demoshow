import { AfterViewInit, Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DemoShowService, ISystemInfo, IWorkInfo } from './demoShow.service';
import { Observable } from 'rxjs/Observable';
import * as echarts from 'echarts';
import 'rxjs/add/observable/interval';
import 'echarts-gl';

Array.prototype.exchangeIndex = function (index1: number, index2: number) {//must be es5 syntax
  let temp = this[index1];
  this[index1] = this[index2];
  this[index2] = temp;
};
const MAX_NODE_COUNT = 4;
const ARR_SIZE_UNIT: Array<string> = ['', 'k', 'm', 'g', 't'];
const MAX_WORKER_COUNT = 4;

enum WORKER_STATUS {RUN, STOP, DEAD}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  myChart: any;
  dataList: Array<[number, number, number]>;
  prevResponseData: Array<IWorkInfo>;
  workerIndexMap: Map<string, number>;
  workerStatus: Map<string, WORKER_STATUS>;
  nodeNames: Map<string, number>;
  totalExistenceTime: string;
  systemInfoStr: string;
  workLoadSum: number;
  chartOption = {
    tooltip: {},
    xAxis3D: {
      type: 'category'
    },
    yAxis3D: {
      type: 'category',
      axisLabel: {
        textStyle: {
          fontSize: 20
        }
      }

    },
    zAxis3D: {
      type: 'value'
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 150,
      viewControl: {
        alpha: 90,
        beta: 0,
        projection: 'orthographic'
      },
      light: {
        main: {
          intensity: 1.2
        },
        ambient: {
          intensity: 0.3
        }
      }
    },
    series: [{
      type: 'bar3D',
      shading: 'color',
      label: {
        show: true,
        formatter: this.getNumberStr,
        textStyle: {
          fontSize: 20,
          borderWidth: 1
        }
      }
    }]
  };

  constructor(private demoShowService: DemoShowService) {
    this.nodeNames = new Map<string, number>();
    this.dataList = Array<[number, number, number]>();
    this.prevResponseData = Array<IWorkInfo>();
    this.workerIndexMap = new Map<string, number>();
    this.workerStatus = new Map<string, WORKER_STATUS>();
  }

  ngAfterViewInit() {
    this.myChart = echarts.init(document.getElementById('main'));
    Observable.interval(1500).subscribe(() => {
      this.demoShowService.getWorkInfoList().subscribe((res: Array<IWorkInfo>) => {
        if (this.prevResponseData.length == 0) {
          this.initOriginData();
          this.initNodeNames(res);
          this.initWorkerIndexAndStatus(res);
          this.updateWorkload(res);
          this.setChartOption();
        } else {
          this.updateNewNodeName(res);
          this.updateWorkerIndexAndStatus(res);
          this.updateWorkload(res);
          this.updateWorkStatus(res);
          this.setChartOption();
        }
        this.prevResponseData = res;
      });
      this.demoShowService.getSystemInfo()
        .subscribe((res: ISystemInfo) => {
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
    });
  }

  initOriginData(): void {
    this.dataList.splice(0, this.dataList.length);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.dataList.push([i, j, 0]);
      }
    }
  }

  initNodeNames(res: Array<IWorkInfo>): void {
    this.nodeNames.clear();
    res.forEach(value => {
      if (this.nodeNames.size < MAX_NODE_COUNT) {
        this.nodeNames.set(value.node_name, 0);
      }
    });
    if (this.nodeNames.size < MAX_NODE_COUNT) {
      for (let i = this.nodeNames.size; i < MAX_NODE_COUNT; i++) {
        this.nodeNames.set(`empty${i}`, 0);
      }
    }
  }

  initWorkerIndexAndStatus(res: Array<IWorkInfo>): void {
    res.forEach((value: IWorkInfo) => {
      if (this.nodeNames.has(value.node_name)) {
        let workIndex = this.nodeNames.get(value.node_name);
        if (workIndex < MAX_WORKER_COUNT){
          let nodeIndex = this.getNameIndex(value.node_name);
          let dataIndex = workIndex * MAX_NODE_COUNT + this.changeIndex(nodeIndex);
          this.workerIndexMap.set(value.worker_id, dataIndex);
          this.workerStatus.set(value.worker_id, WORKER_STATUS.RUN);
          this.nodeNames.set(value.node_name, workIndex + 1);
        }
      }
    });
  }

  updateWorkerIndexAndStatus(res: Array<IWorkInfo>): void {
    res.forEach((value: IWorkInfo) => {
      if (this.nodeNames.has(value.node_name) && this.workerIndexMap.get(value.worker_id) == undefined) {
        let workIndex = this.nodeNames.get(value.node_name);
        if (workIndex < MAX_WORKER_COUNT){
          let nodeIndex = this.getNameIndex(value.node_name);
          let dataIndex = workIndex * MAX_NODE_COUNT + this.changeIndex(nodeIndex);
          this.workerIndexMap.set(value.worker_id, dataIndex);
          this.workerStatus.set(value.worker_id, WORKER_STATUS.RUN);
          this.nodeNames.set(value.node_name, workIndex + 1);
        }
      }
    });
  }

  updateWorkload(res: Array<IWorkInfo>) {
    res.forEach((value: IWorkInfo) => {
      if (this.workerIndexMap.has(value.worker_id)) {
        let dataIndex = this.workerIndexMap.get(value.worker_id);
        this.dataList[dataIndex][2] = value.workload;
      }
    });
  }

  updateWorkStatus(res: Array<IWorkInfo>) {
    this.workerStatus.forEach((value,key) => this.workerStatus.set(key, WORKER_STATUS.DEAD));
    res.forEach((value: IWorkInfo) => {
      if (this.workerIndexMap.has(value.worker_id)) {
        let dataIndex = this.workerIndexMap.get(value.worker_id);
        let oldWorkLoad = this.getOldWorkLoad(value.worker_id);
        let newWorkLoad = this.dataList[dataIndex][2];
        this.workerStatus.set(value.worker_id, newWorkLoad > oldWorkLoad ? WORKER_STATUS.RUN : WORKER_STATUS.STOP);
      }
    });
  }

  updateNewNodeName(res: Array<IWorkInfo>): void {
    let nodeNamesArr = Array.from(this.nodeNames.keys());
    let emptyNode: string = nodeNamesArr.find(value => value.startsWith('empty'));
    res.forEach(value => {
      if (nodeNamesArr.indexOf(value.node_name) < 0 && emptyNode) {
        this.nodeNames.delete(emptyNode);
        this.nodeNames.set(value.node_name, 0);
      }
    });
  }

  setChartOption() {
    this.chartOption['yAxis3D']['data'] = Array.from(this.nodeNames.keys()).reverse();
    this.chartOption['series'][0]['data'] = this.dataList.map((value: [number, number, number], index: number) => {
      return {
        value: [value[0], value[1], value[2]],
        itemStyle: {
          color: this.getWorkColor(index),
          opacity: this.getWorkOpacity(this.getWorkIdByDataIndex(index))
        }
      };
    });
    this.myChart.setOption(this.chartOption);
  }

  changeIndex(oldIndex: number): number {
    switch (oldIndex) {
      case 0:
        return 3;
      case 1:
        return 0;
      case 2:
        return 1;
      case 3:
        return 2;
      default:
        return oldIndex;
    }
  }

  getWorkOpacity(workId: string): number {
    let workInfo = this.prevResponseData.find(value => value.worker_id == workId);
    if (workInfo) {
      return workInfo.worker_version.startsWith('1.') ? 0.4 : 0.8;
    } else {
      return 0.4;
    }
  }

  getNumberStr(params: Object | Array<number>): string {
    let multiple: number = 1;
    let times: number = 0;
    let value: number = params['data'].value[2];
    while (value > 1000) {
      value = value / 1000;
      times += 1;
      multiple *= 1000;
    }
    if (params['data'].value[2] === 0) {
      return params['data'].value[2];
    } else {
      return `${params['data'].value[2]}\n${Math.round(params['data'].value[2] / multiple * 100) / 100}${ARR_SIZE_UNIT[times]}`;
    }
  }

  getNameIndex(nodeName: string): number {
    return Array.from(this.nodeNames.keys()).indexOf(nodeName);
  }

  getOldWorkLoad(workId: string): number {
    let workInfo = this.prevResponseData.find((value => value.worker_id == workId));
    return workInfo ? workInfo.workload : 0;
  }

  getWorkIdByDataIndex(dataIndex: number): string {
    let workId = '';
    this.workerIndexMap.forEach((value, key) => {
      if (value == dataIndex) {
        workId = key;
      }
    });
    return workId;
  }

  getWorkColor(dataIndex: number): string {
    if (this.dataList[dataIndex][2] == 0) {
      return '#ffffff';
    } else {
      let workStatus: WORKER_STATUS = this.workerStatus.get(this.getWorkIdByDataIndex(dataIndex));
      if (workStatus == WORKER_STATUS.RUN) {
        return this.demoShowService.getNumberColor(dataIndex);
      } else if (workStatus == WORKER_STATUS.STOP) {
        return '#484848';
      } else{
        return "#2b2b2b";
      }
    }
  }

  clickEvent(event: MouseEvent) {
    if (event.buttons == 1) {
      this.chartOption.grid3D.viewControl.projection = 'perspective';
      delete this.chartOption.grid3D.viewControl.alpha;
      delete this.chartOption.grid3D.viewControl.beta;
    }
  }

  get runInstanceCount(): number {
    let r: number = 0;
    this.workerStatus.forEach(value => {
      if (value == WORKER_STATUS.RUN) {
        r++;
      }
    });
    return r;
  }

  get deadInstanceCount(): number {
    let r: number = 0;
    this.workerStatus.forEach(value => {
      if (value == WORKER_STATUS.DEAD) {
        r++;
      }
    });
    return r;
  }

  get stopInstanceCount(): number {
    let r: number = 0;
    this.workerStatus.forEach(value => {
      if (value == WORKER_STATUS.STOP) {
        r++;
      }
    });
    return r;
  }

  get totalInstanceCount(): number {
    return this.runInstanceCount + this.stopInstanceCount + this.deadInstanceCount;
  }
}
