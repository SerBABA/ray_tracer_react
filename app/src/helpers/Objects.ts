import { Hit, Ray } from "./Ray";
import { Direction, Point, Vector3 } from "./Vector3";

export interface SceneObject {
  getClosestPointOfIntesection(ray: Ray): Hit | null;
  normal(Point: Point): Direction;
  getReflectionCoefficient(): number;
  getSpecularColor(): Vector3;
}

export class SphereObject implements SceneObject {
  radius: number;
  center: Point;
  colorRGB: Vector3 = new Vector3(0.2, 0.2, 0.2);

  constructor(center: Point, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  normal(surfacePoint: Point): Direction {
    const res = surfacePoint.minus(this.center);
    const dir = new Direction(res.x, res.y, res.z);
    dir.normalize();
    return dir;
  }

  setColor(r: number, g: number, b: number) {
    this.colorRGB.x = r;
    this.colorRGB.y = g;
    this.colorRGB.z = b;
  }

  getClosestPointOfIntesection(ray: Ray): Hit | null {
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
    let t;

    // If either are below zero. This means that the ray is being shot from within the sphere or it is behind the camera.
    if (t1 < 0 || t2 < 0) {
      // Choose the larger one, and if it is negative return null.
      t = Math.max(t1, t2);
      if (t < 0) return null;
    } else {
      // return the correct t value out of the two.
      t = Math.min(t1, t2);
    }

    const hitPoint = new Hit(ray.source.add(ray.direction.multiply(t)), ray);
    hitPoint.setColor(this.colorRGB.x, this.colorRGB.y, this.colorRGB.z);
    return hitPoint;
  }

  getReflectionCoefficient() {
    return 1.5;
  }

  getSpecularColor() {
    return new Vector3(0.1, 0.1, 0.1);
  }
}
