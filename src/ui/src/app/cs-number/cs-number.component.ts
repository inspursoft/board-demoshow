import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { IWorkInfo } from '../demoShow.service';

const ARR_SIZE_UNIT: Array<string> = ['', 'k', 'm', 'g', 't'];

@Component({
  selector: 'cs-number',
  templateUrl: './cs-number.component.html',
  styleUrls: ['./cs-number.component.css']
})
export class CsNumberComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('canvasNumber') canvasNumber: ElementRef;
  @Input() sideLength: number;
  @Input() borderWidth: number = 10;
  @Input() isValid: boolean = false;
  curWorkInfo: IWorkInfo;
  showInfoId: boolean = false;
  showInfoIcon: boolean = false;
  private preWorkInfo: IWorkInfo;
  private canvasElement: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D | null;
  public isRun: boolean = true;
  public backgroundColor: string;
  public fontColor: string;

  ngAfterViewChecked(): void {
    if (this.isValid) {
      if (this.isRun) {
        this.drawBack();
      } else {
        this.drawBorder(this.backgroundColor);
      }
      this.drawWorkLoad();
    } else {
      this.drawBorder(`rgba(217, 217, 217, 1)`);
      this.drawNA();
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

  private getNumberStr(): string {
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

  private drawBorder(backColor: string) {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.sideLength / 2, this.sideLength / 2, this.sideLength / 2, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = backColor;
    this.canvasContext.fill();

    this.canvasContext.beginPath();
    this.canvasContext.arc(this.sideLength / 2, this.sideLength / 2, this.sideLength / 2 - this.borderWidth, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = 'rgba(255, 255, 255, 1)';
    this.canvasContext.fill();
  }

  private drawWorkLoad() {
    this.canvasContext.font = 'bold 40px arial';
    let numberStr = this.getNumberStr();
    let numberWidth = this.canvasContext.measureText(numberStr).width;
    let lineGradient = this.canvasContext.createLinearGradient(0, this.sideLength / 2 - 40, this.sideLength, this.sideLength / 2 - 40);
    let textY = this.curWorkInfo.WorkLoad > 9999 ? this.sideLength / 2 : this.sideLength / 2 + 20;
    lineGradient.addColorStop(0, this.fontColor);
    lineGradient.addColorStop(1, this.fontColor);
    this.canvasContext.fillStyle = this.isRun ? lineGradient : 'rgba(0, 50, 50, 1)';
    this.canvasContext.fillText(numberStr, this.sideLength / 2 - numberWidth / 2, textY, numberWidth);

    if (this.curWorkInfo.WorkLoad > 9999) {
      this.canvasContext.font = '16px arial';
      numberStr = this.curWorkInfo.WorkLoad.toString();
      numberWidth = this.canvasContext.measureText(numberStr).width;
      this.canvasContext.measureText(numberStr).width;
      this.canvasContext.fillText(numberStr, this.sideLength / 2 - numberWidth / 2, this.sideLength / 2 + 40, numberWidth);
    }
  }

  private drawBack() {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.sideLength / 2, this.sideLength / 2, this.sideLength / 2, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = this.isRun ? this.backgroundColor : 'rgba(255, 255, 255, 1)';
    this.canvasContext.fill();
  }

  private drawNA() {
    this.canvasContext.font = 'bold 40px arial';
    let numberStr = "N/A";
    let numberWidth = this.canvasContext.measureText(numberStr).width;
    let textY = this.sideLength / 2 + 15;
    this.canvasContext.fillStyle = 'rgba(215, 215, 215, 1)';
    this.canvasContext.fillText(numberStr, this.sideLength / 2 - numberWidth / 2, textY, numberWidth);
  }
}
