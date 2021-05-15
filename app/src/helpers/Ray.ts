import { SceneObject } from "./Objects";
import { Point, Direction, Vector3 } from "./Vector3";

export class Ray {
  source: Point;
  direction: Direction;
  index: number;

  constructor(source: Point, direction: Direction, index: number) {
    this.source = source;
    this.direction = direction;
    this.index = index;
  }

  trace(sceneObjects: SceneObject[], ambientColor: Vector3, lightPos: Point): Vector3 {
    let color: Vector3 = ambientColor;

    // let closestDist: number = 0;
    for (var i = 0; i < sceneObjects.length; i++) {
      const hit: Hit | null = sceneObjects[i].getClosestPointOfIntesection(this);

      // If we hit an object perform the colour calculations
      if (hit) {
        const ambientTerm: Vector3 = ambientColor.multiply(hit.color);

        const lightDir: Direction = new Direction(
          lightPos.x - hit.x,
          lightPos.y - hit.y,
          lightPos.z - hit.z
        );
        lightDir.normalize();
        const normalDir: Direction = sceneObjects[i].normal(hit);

        const diffuseTerm: Vector3 = hit.color.multiply(Math.max(lightDir.dot(normalDir), 0));

        const h = lightDir.add(hit.ray.direction.flip());
        const specularTerm: Vector3 = sceneObjects[i]
          .getSpecularColor()
          .multiply(Math.max(h.dot(normalDir), 0) ** sceneObjects[i].getReflectionCoefficient());

        color = ambientTerm.add(diffuseTerm);
        color = color.add(specularTerm);
      }
    }

    if (color.x > 1) color.x = 1;
    if (color.y > 1) color.y = 1;
    if (color.z > 1) color.z = 1;

    return color;
  }
}

export class Hit extends Point {
  distance: number;
  ray: Ray;

  constructor(point: Vector3, ray: Ray) {
    super(point.x, point.y, point.z);
    this.ray = ray;
    this.distance = Math.sqrt(
      (point.x - ray.source.x) ** 2 + (point.y - ray.source.y) ** 2 + (point.z - ray.source.z) ** 2
    );
  }
}
