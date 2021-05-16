import { Ray } from "./Ray";
import { Direction, Point, Vector3 } from "./Vector3";

export interface SceneObject {
  color: Vector3;

  getClosestPointOfIntesection(ray: Ray): number | null;
  normal(Point: Point | Vector3): Direction;
  getReflectionCoefficient(): number;
  getSpecularColor(): Vector3;
  setColor(r: number, g: number, b: number): void;
}

export class SphereObject implements SceneObject {
  radius: number;
  center: Point;
  color: Vector3 = new Vector3(0.2, 0.2, 0.2);

  constructor(center: Point, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  normal(surfacePoint: Point | Vector3): Direction {
    const res = surfacePoint.minus(this.center);
    const dir = new Direction(res.x, res.y, res.z);
    dir.normalize();
    return dir;
  }

  setColor(r: number, g: number, b: number) {
    this.color.x = r;
    this.color.y = g;
    this.color.z = b;
  }

  getClosestPointOfIntesection(ray: Ray): number | null {
    // Saving on computation time
    const temp = ray.source.minus(this.center);
    const s: Direction = new Direction(temp.x, temp.y, temp.z);

    const sDotD = s.dot(ray.direction);
    const sDotDSquared = sDotD ** 2;
    const sDotS = s.dot(s);
    const rSquared = this.radius ** 2;

    // Not intersection
    const sqrtInside = sDotDSquared - sDotS + rSquared;

    if (sqrtInside < 0) {
      return null;
    }

    // Calculating the roots
    const t1 = -sDotD + Math.sqrt(sqrtInside);
    const t2 = -sDotD - Math.sqrt(sqrtInside);
    let t = null;

    // If either are below zero. This means that the ray is being shot from within the sphere or it is behind the camera.
    if (t1 < 0 || t2 < 0) {
      // Choose the larger one, and if it is negative return null.
      t = Math.max(t1, t2);
      if (t < 0) return null;
    } else {
      // return the correct t value out of the two.
      t = Math.min(t1, t2);
    }

    return t;
  }

  getReflectionCoefficient() {
    return 3.5;
  }

  getSpecularColor() {
    return new Vector3(0.07, 0.07, 0.07);
  }
}
