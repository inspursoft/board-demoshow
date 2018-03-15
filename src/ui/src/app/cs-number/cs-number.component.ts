import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { IWorkInfo } from '../demoShow.service';

@Component({
  selector: 'cs-number',
  templateUrl: './cs-number.component.html',
  styleUrls: ['./cs-number.component.css']
})
export class CsNumberComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('canvasNumber') canvasNumber: ElementRef;
  @Input() sideLength: number = 200;
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

  private drawWorkLoad() {
    this.canvasContext.font = 'bold 80px arial';
    let numberWidth = this.canvasContext.measureText(this.workInfo.WorkLoad.toString()).width;
    let lineGradient = this.canvasContext.createLinearGradient (0, this.sideLength / 2 - 40, this.sideLength, this.sideLength / 2 - 40);
    lineGradient.addColorStop(0, this.fontColor);
    lineGradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
    this.canvasContext.fillStyle = this.isRun ? lineGradient : 'rgba(0, 0, 0, 1)';
    this.canvasContext.fillText(this.workInfo.WorkLoad.toString(), this.sideLength/2 - numberWidth / 2, this.sideLength / 2 + 40, numberWidth);
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
