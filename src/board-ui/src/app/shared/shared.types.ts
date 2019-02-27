import { HttpErrorResponse } from "@angular/common/http";
import { Type } from "@angular/core";
import {TimeoutError} from 'rxjs';

export enum RETURN_STATUS {
  rsNone, rsConfirm, rsCancel
}

export enum BUTTON_STYLE {
  CONFIRMATION = 1, DELETION, YES_NO, ONLY_CONFIRM
}

export class Message {
  title: string = '';
  message: string = '';
  data: any;
  buttonStyle: BUTTON_STYLE = BUTTON_STYLE.CONFIRMATION;
  returnStatus: RETURN_STATUS = RETURN_STATUS.rsNone;
}

export type AlertType = 'alert-success' | 'alert-danger' | 'alert-info' | 'alert-warning';

export class AlertMessage {
  message: string = '';
  alertType: AlertType = 'alert-success';
}

export enum GlobalAlertType {
  gatNormal, gatShowDetail, gatLogin
}

export class GlobalAlertMessage {
  type: GlobalAlertType = GlobalAlertType.gatNormal;
  message: string = '';
  alertType: AlertType = 'alert-danger';
  errorObject: HttpErrorResponse | Type<Error> | TimeoutError;
  endMessage: string = '';
}

export interface INumber {
  sideLength: number;
  backColor: string;
  fontColor: string;
}

export interface IWorkInfo {
  worker_id: string;
  worker_version: string;
  workload: number;
  node_name: string;
  isValid: boolean;
  isRun: boolean;
}

export interface INumberColor {
  backColor: string;
  fontColor: string;
}

export interface ISystemInfo {
  time_stamp: number,
  system_version: string,
  sum_workload: number,
  work_way: number
}

export class Point {
  x = 0;
  y = 0;

  static newPoint(): Point {
    return new Point();
  }

  static newPointByPoint(point: Point): Point {
    let result = new Point();
    result.x = point.x;
    result.y = point.y;
    return result;
  }

  static newPointByValue(x, y: number): Point {
    let result = new Point();
    result.x = x;
    result.y = y;
    return result;
  }

  isSamePoint(point: Point): boolean {
    return Math.abs(this.x - point.x) < 0.01 && Math.abs(this.y - point.y) < 0.01;
  }

  isSameX(point: Point): boolean {
    return this.x + 0.01 > point.x && this.x < point.x + 0.01;
  }

  isSameY(point: Point): boolean {
    return this.y + 0.01 > point.y && this.y < point.y + 0.01;
  }

  distance(point: Point): number {
    let distancePowX = Math.pow(Math.abs(this.x - point.x), 2);
    let distancePowY = Math.pow(Math.abs(this.y - point.y), 2);
    return Math.sqrt(distancePowX + distancePowY);
  }

  calculateRelativePosition(point: Point): RelativePosition {
    if (this.isSamePoint(point)) {
      return RelativePosition.wrpSame;
    } else if (this.isSameX(point)) {
      if (point.y > this.y) {
        return RelativePosition.wrpBottom;
      } else {
        return RelativePosition.wrpTop;
      }
    } else if (this.isSameY(point)) {
      if (point.x > this.x) {
        return RelativePosition.wrpRight;
      } else {
        return RelativePosition.wrpLeft;
      }
    } else if (point.x > this.x && point.y < this.y) {
      return RelativePosition.wrpQuadrantA;
    } else if (point.x < this.x && point.y > this.y) {
      return RelativePosition.wrpQuadrantB;
    } else if (point.x < this.x && point.y > this.y) {
      return RelativePosition.wrpQuadrantC;
    } else if (point.x > this.x && point.y > this.y) {
      return RelativePosition.wrpQuadrantD;
    }
  }
}

export class Circle {
  center: Point;
  radius: number = 0;

  constructor(center: Point, radius: number) {
    this.center = Point.newPointByPoint(center);
    this.radius = radius;
  }

  getMountQuadrantA(): Point {
    return Point.newPointByValue(
      this.center.x + Math.cos(45 / 180 * Math.PI) * this.radius,
      this.center.y - Math.sin(45 / 180 * Math.PI) * this.radius);
  }

  getMountQuadrantB(): Point {
    return Point.newPointByValue(
      this.center.x - Math.sin(45 / 180 * Math.PI) * this.radius,
      this.center.y - Math.cos(45 / 180 * Math.PI) * this.radius);
  }

  getMountQuadrantC(): Point {
    return Point.newPointByValue(
      this.center.x - Math.cos(45 / 180 * Math.PI) * this.radius,
      this.center.y + Math.sin(45 / 180 * Math.PI) * this.radius);
  }

  getMountQuadrantD(): Point {
    return Point.newPointByValue(
      this.center.x + Math.sin(45 / 180 * Math.PI) * this.radius,
      this.center.y + Math.cos(45 / 180 * Math.PI) * this.radius);
  }

  getRelativePoint(point: Point, isSource: boolean): Point {
    switch (this.center.calculateRelativePosition(point)) {
      case RelativePosition.wrpSame:
        return this.center;
      case RelativePosition.wrpLeft:
        return isSource ? this.getMountQuadrantB() : this.getMountQuadrantC();
      case RelativePosition.wrpRight:
        return isSource ? this.getMountQuadrantA() : this.getMountQuadrantD();
      case RelativePosition.wrpTop:
        return isSource ? this.getMountQuadrantB() : this.getMountQuadrantA();
      case RelativePosition.wrpBottom:
        return isSource ? this.getMountQuadrantC() : this.getMountQuadrantD();
      case RelativePosition.wrpQuadrantA:
        return this.getMountQuadrantA();
      case RelativePosition.wrpQuadrantB:
        return this.getMountQuadrantB();
      case RelativePosition.wrpQuadrantC:
        return this.getMountQuadrantC();
      case RelativePosition.wrpQuadrantD:
        return this.getMountQuadrantD();
    }
  }
}

export enum RelativePosition {
  wrpSame, wrpLeft, wrpRight, wrpBottom, wrpTop, wrpQuadrantA, wrpQuadrantB, wrpQuadrantC, wrpQuadrantD
}
