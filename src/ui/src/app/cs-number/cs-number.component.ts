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
  @Input() borderWidth: number = 5;
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
        if (this.isFirstVersion) {
          this.drawBack();
        } else {
          this.drawHeptagon(this.defaultRadius, this.backgroundColor);
        }
        this.drawWorkLoad(this.fontColor);
      } else {
        if (this.isFirstVersion) {
          this.drawBorder(this.defaultRadius, this.backgroundColor);
          this.drawBorder(this.defaultRadius - this.borderWidth, 'rgba(255, 255, 255, 1)');
        } else {
          this.drawHeptagon(this.defaultRadius, this.backgroundColor);
          this.drawHeptagon(this.defaultRadius - this.borderWidth, 'rgba(255, 255, 255, 1)');
        }
        this.drawWorkLoad('rgba(0, 50, 50, 1)');
      }
    } else {
      if (this.isFirstVersion){
        this.drawBorder(this.defaultRadius, `rgba(217, 217, 217, 1)`);
        this.drawBorder(this.defaultRadius - this.borderWidth, `rgba(255, 255, 255, 1)`);
      } else {
        this.drawHeptagon(this.defaultRadius, `rgba(217, 217, 217, 1)`);
        this.drawHeptagon(this.defaultRadius - this.borderWidth, 'rgba(255, 255, 255, 1)');
      }
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
      this.isRun = this.curWorkInfo.workload > this.preWorkInfo.workload;
    }
    this.preWorkInfo = value;
  };

  get workInfo(): IWorkInfo {
    return this.curWorkInfo;
  }

  get isFirstVersion(): boolean {
    return this.curWorkInfo.worker_version.startsWith('1.');
  }

  get defaultRadius(): number {
    return this.sideLength / 2;
  }

  private getNumberStr(): string {
    let multiple: number = 1;
    let times: number = 0;
    let value: number = this.workInfo.workload;
    while (value > 1000) {
      value = value / 1000;
      times += 1;
      multiple *= 1000;
    }
    return `${Math.round(this.workInfo.workload / multiple * 100) / 100}${ARR_SIZE_UNIT[times] }`;
  }

  private drawHeptagon(radius: number, fillColor: string): void {
    this.canvasContext.beginPath();
    this.canvasContext.fillStyle = fillColor;
    let radAngle = Math.PI * 2 / 7;
    let radAlpha = 270 * Math.PI / 180;
    let xPos = this.sideLength / 2 + Math.cos(radAlpha) * (radius);
    let yPos = this.sideLength / 2 + Math.sin(radAlpha) * (radius);
    this.canvasContext.moveTo(xPos, yPos);
    for (let i = 0; i < 7; i++) {
      let rad = radAngle * i + radAlpha;
      xPos = this.sideLength / 2 + Math.cos(rad) * (radius);
      yPos = this.sideLength / 2 + Math.sin(rad) * (radius);
      this.canvasContext.lineTo(xPos, yPos);
    }
    this.canvasContext.closePath();
    this.canvasContext.fill();
  }

  private drawBorder(radius: number, backColor: string) {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.sideLength / 2, this.sideLength / 2, radius, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = backColor;
    this.canvasContext.fill();
  }

  private drawWorkLoad(fontColor: string) {
    this.canvasContext.font = 'bold 36px arial';
    let numberStr = this.getNumberStr();
    let numberWidth = this.canvasContext.measureText(numberStr).width;
    let lineGradient = this.canvasContext.createLinearGradient(0, this.sideLength / 2 - 40, this.sideLength, this.sideLength / 2 - 40);
    let textY = this.curWorkInfo.workload > 999 ? this.sideLength / 2 : this.sideLength / 2 + 10;
    lineGradient.addColorStop(0, fontColor);
    lineGradient.addColorStop(1, fontColor);
    this.canvasContext.fillStyle = lineGradient;
    this.canvasContext.fillText(numberStr, this.sideLength / 2 - numberWidth / 2, textY, numberWidth);

    if (this.curWorkInfo.workload > 999) {
      this.canvasContext.font = '16px arial';
      numberStr = this.curWorkInfo.workload.toString();
      numberWidth = this.canvasContext.measureText(numberStr).width;
      this.canvasContext.measureText(numberStr).width;
      this.canvasContext.fillText(numberStr, this.sideLength / 2 - numberWidth / 2, this.sideLength / 2 + 40, numberWidth);
    }
  }

  private drawBack() {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.sideLength / 2, this.sideLength / 2, this.sideLength / 2, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = this.backgroundColor;
    this.canvasContext.fill();
  }

  private drawNA() {
    this.canvasContext.font = 'bold 40px arial';
    let numberStr = 'N/A';
    let numberWidth = this.canvasContext.measureText(numberStr).width;
    let textY = this.sideLength / 2 + 15;
    this.canvasContext.fillStyle = 'rgba(215, 215, 215, 1)';
    this.canvasContext.fillText(numberStr, this.sideLength / 2 - numberWidth / 2, textY, numberWidth);
  }
}
