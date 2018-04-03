import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { IWorkInfo } from '../demoShow.service';

const ARR_SIZE_UNIT: Array<string> = ["", "k", "m", "g", "t"];
@Component({
  selector: 'cs-number',
  templateUrl: './cs-number.component.html',
  styleUrls: ['./cs-number.component.css']
})
export class CsNumberComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('canvasNumber') canvasNumber: ElementRef;
  @Input() sideLength: number = 250;
  @Input() isValid: boolean = false;
  private preWorkInfo: IWorkInfo;
  private curWorkInfo: IWorkInfo;
  private canvasElement: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D | null;
  private isRun: boolean = true;
  public backgroundColor: string;
  public fontColor: string;

  ngAfterViewChecked(): void {
    if (this.isValid) {
      this.drawBack();
      this.drawWorkLoad();
    }
  }

  ngAfterViewInit(): void {
    this.canvasElement = this.canvasNumber.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }

  ngOnDestroy(): void {
    // console.log('CsNumberComponent.ngOnDestroy');
  }

  set workInfo(value: IWorkInfo) {
    this.curWorkInfo = value;
    if (this.preWorkInfo) {
      this.isRun = this.curWorkInfo.WorkLoad > this.preWorkInfo.WorkLoad;
    }
    this.preWorkInfo = value;
  };

  get workInfo(): IWorkInfo {
    return this.curWorkInfo;
  }

  private getNumberStr():string{
    let multiple: number = 1;
    let times: number = 0;
    let value: number = this.workInfo.WorkLoad;
    while (value > 1000) {
      value = value / 1000;
      times += 1;
      multiple *= 1000;
    }
    return `${Math.round(this.workInfo.WorkLoad / multiple * 100) / 100}${ARR_SIZE_UNIT[times] }`;
  }

  private drawWorkLoad() {
    this.canvasContext.font = 'bold 70px arial';
    let numberStr = this.getNumberStr();
    let numberWidth = this.canvasContext.measureText(numberStr).width;
    let lineGradient = this.canvasContext.createLinearGradient (0, this.sideLength / 2 - 40, this.sideLength, this.sideLength / 2 - 40);
    lineGradient.addColorStop(0, this.fontColor);
    lineGradient.addColorStop(1, this.fontColor);
    this.canvasContext.fillStyle = this.isRun ? lineGradient : 'rgba(0, 0, 0, 1)';
    this.canvasContext.fillText(numberStr, this.sideLength/2 - numberWidth / 2, this.sideLength / 2 + 35, numberWidth);
    this.canvasContext.stroke();
  }

  private drawBack() {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.sideLength / 2, this.sideLength / 2, this.sideLength / 2, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = this.isRun ? this.backgroundColor : 'rgba(255, 255, 255, 1)';
    this.canvasContext.fill();
    this.canvasContext.stroke();
  }

}
