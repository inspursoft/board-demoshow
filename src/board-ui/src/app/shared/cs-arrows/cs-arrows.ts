import {Point} from '../shared.types';
export class CsArrows {

  constructor(private ctx: CanvasRenderingContext2D,
              private startPoint: Point,
              private endPoint: Point) {
  }

  beginToDraw() {
    // this.ctx.beginPath();
    // this.ctx.lineCap = 'round';
    // this.ctx.lineWidth = 3;
    // this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    // this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    // this.ctx.strokeStyle = 'blue';
    // this.ctx.stroke();
    // this.ctx.closePath();

    let lineGradient = this.ctx.createLinearGradient(
      this.startPoint.x,
      this.startPoint.y,
      this.endPoint.x,
      this.endPoint.y
    );
    lineGradient.addColorStop(0, 'pink');
    lineGradient.addColorStop(1, 'red');


    // this.ctx.beginPath();
    // this.ctx.lineWidth = 3;
    // this.ctx.strokeStyle = lineGradient;
    // this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    // this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
    // this.ctx.stroke();
    // this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = lineGradient;
    this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
    let c = Point.newPointByValue(300, 100);
    let r = this.startPoint.distance(c);
    let x = Math.PI / 2 - Math.atan((c.y - this.startPoint.y )/ (c.x - this.startPoint.x));
    let y = r / Math.cos(x);
    this.ctx.arcTo(
      c.x,
      this.startPoint.y - y,
      this.endPoint.x,
      this.endPoint.y,
      r);
    // this.ctx.bezierCurveTo(
    //   this.startPoint.x,
    //   this.startPoint.y + 60,
    //   this.endPoint.x,
    //   this.endPoint.y + 60,
    //   this.endPoint.x,
    //   this.endPoint.y);
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.moveTo(c.x, c.y + r);
    this.ctx.lineTo(c.x - 30, c.y + r - Math.tan(30 / 180 * Math.PI) * 30);
    this.ctx.lineTo(c.x - 30, c.y + r + Math.tan(30 / 180 * Math.PI) * 30);
    this.ctx.lineTo(c.x, c.y + r);
    this.ctx.fillStyle = lineGradient;
    this.ctx.fill();
    this.ctx.closePath();

  }
}
