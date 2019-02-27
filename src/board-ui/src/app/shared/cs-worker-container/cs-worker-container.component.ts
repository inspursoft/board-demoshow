import {AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {CsWorker} from '../cs-worker/cs-worker';
import {CsArrows} from '../cs-arrows/cs-arrows';
import {IWorkInfo, Point} from '../shared.types';

@Component({
  selector: 'cs-worker-container',
  templateUrl: './cs-worker-container.component.html'
})
export class CsWorkerContainerComponent implements AfterViewInit {
  @Input() sideLength = 0;
  @ViewChild('workerContainer') workerContainer: ElementRef;

  ngAfterViewInit(): void {
    let workerInfo: IWorkInfo = {
      worker_id: 'workerId',
      worker_version: '1.0',
      workload: 88,
      node_name: '10.0.0.1',
      isValid: true,
      isRun: true
    };
    let center = Point.newPointByValue(100, 100);
    let ctx = (this.workerContainer.nativeElement as HTMLCanvasElement).getContext('2d');
    let worker1 = new CsWorker(workerInfo, 100, center, ctx);
    worker1.backgroundColor = 'pink';
    worker1.beginToDraw();

    workerInfo.workload = 99;
    center.x = 500;
    let worker2 = new CsWorker(workerInfo, 100, center, ctx);
    worker2.backgroundColor = 'red';
    worker2.beginToDraw();

    let startPoint = worker1.circle.getRelativePoint(worker2.center, true);
    let endPoint = worker2.circle.getRelativePoint(worker1.center, true);
    let arrows1 = new CsArrows(ctx,startPoint,endPoint);
    arrows1.beginToDraw();

    let startPoint1 = worker2.circle.getRelativePoint(worker1.center, false);
    let endPoint1 = worker1.circle.getRelativePoint(worker2.center, false);
    console.log(startPoint1);
    console.log(endPoint1);
    let arrows2 = new CsArrows(ctx,endPoint1,startPoint1);
    arrows2.beginToDraw();
  }
}
