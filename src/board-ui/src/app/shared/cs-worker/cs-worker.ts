import {Circle, IWorkInfo, Point} from '../shared.types';
import {ARR_SIZE_UNIT} from '../shared.const';

export class CsWorker {
  public circle: Circle;
  public backgroundColor = 'white';
  public fontColor = 'black';
  public borderWidth = 5;
  public center: Point;

  constructor(private curWorkInfo: IWorkInfo,
              private radius: number,
              center: Point,
              private ctx: CanvasRenderingContext2D) {
    this.center = Point.newPointByPoint(center);
    this.circle = new Circle(this.center, this.radius);
  }

  get isFirstVersion(): boolean {
    return this.curWorkInfo.worker_version.startsWith('1.');
  }

  beginToDraw(): void {
    if (this.curWorkInfo.isValid) {
      if (this.curWorkInfo.isRun) {
        if (this.isFirstVersion) {
          this.drawBack();
        } else {
          this.drawHeptagon(this.radius, this.backgroundColor);
        }
        this.drawWorkLoad(this.fontColor);
      } else {
        if (this.isFirstVersion) {
          this.drawBorder(this.radius, this.backgroundColor);
          this.drawBorder(this.radius - this.borderWidth, 'rgba(255, 255, 255, 1)');
        } else {
          this.drawHeptagon(this.radius, this.backgroundColor);
          this.drawHeptagon(this.radius - this.borderWidth, 'rgba(255, 255, 255, 1)');
        }
        this.drawWorkLoad('rgba(0, 50, 50, 1)');
      }
    } else {
      if (this.isFirstVersion) {
        this.drawBorder(this.radius, `rgba(217, 217, 217, 1)`);
        this.drawBorder(this.radius - this.borderWidth, `rgba(255, 255, 255, 1)`);
      } else {
        this.drawHeptagon(this.radius, `rgba(217, 217, 217, 1)`);
        this.drawHeptagon(this.radius - this.borderWidth, 'rgba(255, 255, 255, 1)');
      }
      this.drawNA();
    }
  }

  private drawBack() {
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fill();
  }

  private getNumberStr(): string {
    let multiple: number = 1;
    let times: number = 0;
    let value: number = this.curWorkInfo.workload;
    while (value > 1000) {
      value = value / 1000;
      times += 1;
      multiple *= 1000;
    }
    return `${Math.round(this.curWorkInfo.workload / multiple * 100) / 100}${ARR_SIZE_UNIT[times]}`;
  }

  private drawBorder(radius: number, backColor: string) {
    this.ctx.beginPath();
    this.ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2, true);
    this.ctx.fillStyle = backColor;
    this.ctx.fill();
  }

  private drawWorkLoad(fontColor: string) {
    this.ctx.font = 'bold 36px arial';
    let numberStr = this.getNumberStr();
    let numberWidth = this.ctx.measureText(numberStr).width;
    let lineGradient = this.ctx.createLinearGradient(
      this.center.x - this.radius,
      this.center.y,
      this.center.x + this.radius,
      this.center.y
    );
    let textY = this.curWorkInfo.workload > 999 ? this.center.y : this.center.y + 10;
    lineGradient.addColorStop(0, fontColor);
    lineGradient.addColorStop(1, fontColor);
    this.ctx.fillStyle = lineGradient;
    this.ctx.fillText(numberStr, this.center.x - numberWidth / 2, textY, numberWidth);
    if (this.curWorkInfo.workload > 999) {
      this.ctx.font = '16px arial';
      numberStr = this.curWorkInfo.workload.toString();
      numberWidth = this.ctx.measureText(numberStr).width;
      this.ctx.measureText(numberStr).width;
      this.ctx.fillText(numberStr, this.center.x - numberWidth / 2, this.center.y + 40, numberWidth);
    }
  }

  private drawHeptagon(radius: number, fillColor: string): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = fillColor;
    let radAngle = Math.PI * 2 / 7;
    let radAlpha = 270 * Math.PI / 180;
    let xPos = this.radius + Math.cos(radAlpha) * (radius);
    let yPos = this.radius + Math.sin(radAlpha) * (radius);
    this.ctx.moveTo(xPos, yPos);
    for (let i = 0; i < 7; i++) {
      let rad = radAngle * i + radAlpha;
      xPos = this.radius + Math.cos(rad) * (radius);
      yPos = this.radius + Math.sin(rad) * (radius);
      this.ctx.lineTo(xPos, yPos);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawNA() {
    this.ctx.font = 'bold 40px arial';
    let numberStr = 'N/A';
    let numberWidth = this.ctx.measureText(numberStr).width;
    let textY = this.radius + 15;
    this.ctx.fillStyle = 'rgba(215, 215, 215, 1)';
    this.ctx.fillText(numberStr, this.radius - numberWidth / 2, textY, numberWidth);
  }
}
