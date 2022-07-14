import { clamp } from '@/helpers';
import * as events from "events";

interface VectorLike {
  x: number;
  y: number;
  z: number;
  w?: number;
}

export class EnhancedDOMPoint extends DOMPoint {
  get u() {
    return this.x;
  }

  set u(u: number) {
    this.x = u;
  }

  get v() {
    return this.y;
  }

  set v(v: number) {
    this.y = v;
  }

  add(otherVector: EnhancedDOMPoint) {
    this.addVectors(this, otherVector);
    return this;
  }

  addVectors(v1: EnhancedDOMPoint, v2: EnhancedDOMPoint) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
    this.z = v1.z + v2.z;
    return this;
  }

  set(x?: number | VectorLike, y?: number, z?: number): EnhancedDOMPoint {
    if (x && typeof x === 'object') {
      y = x.y;
      z = x.z;
      x = x.x;
    }
    this.x = x !== undefined ? x : this.x;
    this.y = y !== undefined ? y : this.y;
    this.z = z !== undefined ? z : this.z;
    return this;
  }

  clone() {
    return new EnhancedDOMPoint(this.x, this.y, this.z, this.w);
  }

  scale(scaleBy: number) {
    this.x *= scaleBy;
    this.y *= scaleBy;
    this.z *= scaleBy;
    return this;
  }

  subtract(otherVector: EnhancedDOMPoint) {
   this.subtractVectors(this, otherVector);
    return this;
  }

  subtractVectors(v1: EnhancedDOMPoint, v2: EnhancedDOMPoint) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
    this.z = v1.z - v2.z;
    return this;
  }

  cross(otherVector: EnhancedDOMPoint) {
    this.crossVectors(this, otherVector);
    return this;
  }

  crossVectors(v1: EnhancedDOMPoint, v2: EnhancedDOMPoint) {
    const x = v1.y * v2.z - v1.z * v2.y;
    const y = v1.z * v2.x - v1.x * v2.z;
    const z = v1.x * v2.y - v1.y * v2.x;
    this.x = x
    this.y = y
    this.z = z
    return this;
  }

  dot(otherVector: EnhancedDOMPoint): number {
    return this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  get magnitude() {
    return Math.hypot(...this.toArray());
  }

  normalize() {
    const magnitude = this.magnitude;
    if (magnitude === 0) {
      return new EnhancedDOMPoint();
    }
    this.x /= magnitude;
    this.y /= magnitude;
    this.z /= magnitude;
    return this;
  }

  setFromRotationMatrix(matrix: DOMMatrix) {
    this.y = Math.asin(clamp(matrix.m13, -1, 1));
    if (Math.abs(matrix.m13) < 0.9999999) {
      this.x = Math.atan2(-matrix.m23, matrix.m33);
      this.z = Math.atan2(-matrix.m12, matrix.m11);
    } else {
      this.x = Math.atan2(matrix.m32, matrix.m22);
      this.z = 0;
    }
    return this;
  }

  lerp(otherVector: EnhancedDOMPoint, alpha: number) {
    this.x += ( otherVector.x - this.x ) * alpha;
    this.y += ( otherVector.y - this.y ) * alpha;
    this.z += ( otherVector.z - this.z ) * alpha;
    return this;
  }

  modifyComponents(callback: (component: number) => number) {
    this.x = callback(this.x);
    this.y = callback(this.y);
    this.z = callback(this.z);
    return this;
  }
}
