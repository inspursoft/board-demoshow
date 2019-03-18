import {Component, ElementRef, Input, AfterContentInit, ViewChild, AfterViewChecked} from '@angular/core';

enum HandType {htSecond, htMin, htHour}

const CLOCK_CENTER_RADIUS = 5;

@Component({
  selector: 'app-cs-clock',
  templateUrl: './cs-clock.component.html',
  styleUrls: ['./cs-clock.component.css']
})
export class CsClockComponent implements AfterContentInit, AfterViewChecked {
  @ViewChild('canvasClock') canvasClock: ElementRef;
  @Input() sideLength: number = 70;
  @Input() clockFontHeight: number = 26;
  private canvasElement: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D | null;

  constructor() {

  }

  get radius(): number {
    return this.sideLength;
  }

  ngAfterViewChecked(): void {
    // console.log('CsClockComponent.ngAfterViewChecked');
  }

  ngAfterContentInit() {
    this.canvasElement = this.canvasClock.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.canvasContext.font = `${this.clockFontHeight}px Arial`;
    setInterval(() => this.drawClock(), 1000);
  }

  private drawClockBack() {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.radius, this.radius, this.radius * 2 + 1, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = `rgba(0, 0, 0, 0)`;
    this.canvasContext.fill();
    this.canvasContext.stroke();

    this.canvasContext.font = 'bold 16px arial';
    const lineGradient = this.canvasContext.createLinearGradient(this.radius, this.radius, this.radius + 50, this.radius + 50);
    lineGradient.addColorStop(0, 'rgba(0, 0, 255, 1)');
    lineGradient.addColorStop(1, 'rgba(240, 0, 0, 0.8)');
    this.canvasContext.fillStyle = lineGradient;
    const numberWidth = this.canvasContext.measureText('Board').width;
    this.canvasContext.fillText('Board', this.radius - numberWidth / 2, this.radius + this.radius / 2, numberWidth);
    this.canvasContext.stroke();
  }

  private drawNumbers() {
    const clockNumbers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.canvasContext.beginPath();
    this.canvasContext.fillStyle = 'black';
    this.canvasContext.font = 'italic small-caps bold 14px arial';
    let angle = 0, numberWidth = 0;
    clockNumbers.forEach(value => {
      angle = Math.PI / 6 * (value - 3);
      numberWidth = this.canvasContext.measureText(value.toString()).width;
      const number_X = this.radius + Math.cos(angle) * (this.radius * 0.8) - numberWidth / 2;
      const number_Y = this.radius + Math.sin(angle) * (this.radius * 0.8);
      this.canvasContext.fillText(value.toString(), number_X, number_Y, numberWidth);
    });
  }

  private drawCenter() {
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.radius, this.radius, CLOCK_CENTER_RADIUS + 1, 0, Math.PI * 2, true);
    this.canvasContext.strokeStyle = 'black';
    this.canvasContext.stroke();

    this.canvasContext.beginPath();
    this.canvasContext.arc(this.radius, this.radius, CLOCK_CENTER_RADIUS, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = 'white';
    this.canvasContext.fill();

    this.canvasContext.beginPath();
    this.canvasContext.arc(this.radius, this.radius, CLOCK_CENTER_RADIUS - 2, 0, Math.PI * 2, true);
    this.canvasContext.fillStyle = 'red';
    this.canvasContext.fill();
  }

  private drawHand(htType: HandType) {
    let date = new Date();
    let clockNum: number = 0;
    this.canvasContext.beginPath();
    let handRadius: number = 0;
    switch (htType) {
      case HandType.htSecond: {
        clockNum = date.getSeconds();
        let baseAngle = (clockNum / 60) * (Math.PI * 2) - Math.PI / 2;
        handRadius = this.radius * 0.95;
        this.canvasContext.moveTo(this.radius, this.radius);
        this.canvasContext.lineTo(this.radius + handRadius * Math.cos(baseAngle), this.radius + handRadius * Math.sin(baseAngle));
        this.canvasContext.strokeStyle = 'red';
        this.canvasContext.stroke();
        break;
      }
      case HandType.htMin: {
        handRadius = this.radius * 0.75;
        clockNum = date.getMinutes();
        let baseAngle = (clockNum / 60) * (Math.PI * 2) - Math.PI / 2;
        let actuallyAngle = baseAngle - Math.PI / 2;
        this.canvasContext.moveTo(this.radius - CLOCK_CENTER_RADIUS * Math.cos(actuallyAngle), this.radius - CLOCK_CENTER_RADIUS * Math.sin(actuallyAngle));
        this.canvasContext.lineTo(this.radius + handRadius * Math.cos(baseAngle), this.radius + handRadius * Math.sin(baseAngle));
        this.canvasContext.lineTo(this.radius + CLOCK_CENTER_RADIUS * Math.cos(actuallyAngle), this.radius + CLOCK_CENTER_RADIUS * Math.sin(actuallyAngle));
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.fill();
        break;
      }
      case HandType.htHour: {
        clockNum = date.getHours();
        clockNum = clockNum > 12 ? clockNum - 12 : clockNum;
        clockNum = clockNum * 5 + (date.getMinutes() / 60 * 5);
        let baseAngle = (clockNum / 60) * (Math.PI * 2) - Math.PI / 2;
        let actuallyAngle = baseAngle - Math.PI / 2;
        handRadius = this.radius * 0.5;
        this.canvasContext.moveTo(this.radius - CLOCK_CENTER_RADIUS * Math.cos(actuallyAngle), this.radius - CLOCK_CENTER_RADIUS * Math.sin(actuallyAngle));
        this.canvasContext.lineTo(this.radius + handRadius * Math.cos(baseAngle), this.radius + handRadius * Math.sin(baseAngle));
        this.canvasContext.lineTo(this.radius + CLOCK_CENTER_RADIUS * Math.cos(actuallyAngle), this.radius + CLOCK_CENTER_RADIUS * Math.sin(actuallyAngle));
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.fill();
        break;
      }
    }
  }

  private drawClock() {
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.drawClockBack();
    this.drawNumbers();
    this.drawHand(HandType.htMin);
    this.drawHand(HandType.htHour);
    this.drawCenter();
    this.drawHand(HandType.htSecond);
  }
}
