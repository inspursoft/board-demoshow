import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'cs-title',
  template: `
    <div style="display: flex;justify-content: center;">
      <canvas #canvasTitle [height]="height" [width]="width"></canvas>
    </div>`,
})
export class CsTitleComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('canvasTitle') canvasTitle: ElementRef;
  @Input() width: number = 600;
  @Input() height: number = 100;
  @Input() title: string = '';
  private canvasElement: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D | null;

  ngAfterViewChecked(): void {

  }

  ngAfterViewInit(): void {
    this.canvasElement = this.canvasTitle.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.drawBack();
    this.drawTitle();
  }

  private drawTitle() {
    this.canvasContext.font = 'bold 80px arial';
    let lineGradient = this.canvasContext.createLinearGradient(0, 0, this.width, this.height);
    lineGradient.addColorStop(0, 'rgba(0, 0, 255, 1)');
    lineGradient.addColorStop(1, 'rgba(240, 0, 0, 0.8)');
    this.canvasContext.fillStyle = lineGradient;
    let numberWidth = this.canvasContext.measureText(this.title).width;
    this.canvasContext.fillText(this.title, (this.width - numberWidth) / 2, this.height / 2 + 40, numberWidth);
    this.canvasContext.stroke();
  }

  private drawBack() {
    this.canvasContext.beginPath();
    this.canvasContext.rect(-1, -1, this.width + 3, this.height + 3);
    this.canvasContext.fillStyle = 'rgba(0,0,0,0)';
    this.canvasContext.fill();
    this.canvasContext.stroke();
  }
}
