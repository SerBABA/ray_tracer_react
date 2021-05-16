import { SceneObject } from "./Objects";
import { Point, Direction, Vector3 } from "./Vector3";

const MAX_STEPS: number = 2;

export class Ray {
  source: Point | Vector3;
  direction: Direction;

  constructor(source: Point | Vector3, direction: Direction) {
    this.source = source;
    this.direction = direction;
  }

  trace(
    sceneObjects: SceneObject[],
    ambientColor: Vector3,
    lightPos: Point,
    step: number = 0
  ): Vector3 {
    let color: Vector3 = ambientColor;

    // let closestDist: number = 0;
    const hit: Hit | null = this.getClosestPoint(sceneObjects);
    // If we hit an object perform the colour calculations
    if (!hit) {
      return color;
    }

    // Get the light direction vector (no normalized, so we can get the distance vector)
    const lightDir: Direction = new Direction(
      lightPos.x - hit.x,
      lightPos.y - hit.y,
      lightPos.z - hit.z
    );

    // Used to figure out if a point is in shadow.
    const lightDist: number = lightDir.Distance;

    // We need to normalize the light Vector
    lightDir.normalize();

    // Testing for if we are under an object (not in shadow, the light could be closer!)
    const shadowRay: Ray = new Ray(hit.Point.add(lightDir.multiply(0.0001)), lightDir);
    const shadowHit: Hit | null = shadowRay.getClosestPoint(sceneObjects);

    // Get tge ambient term of the color
    const ambientTerm: Vector3 = ambientColor.multiply(hit.color);

    if (shadowHit !== null && lightDist > shadowHit.distance) {
      // is in shadow!
      color = ambientTerm;
    } else {
      // Get the diffuse term
      const diffuseTerm: Vector3 = hit.color.multiply(Math.max(lightDir.dot(hit.normal), 0));

      // Calculate the specular term
      const h = lightDir.add(hit.ray.direction.flip());
      const specularTerm: Vector3 = hit.object
        .getSpecularColor()
        .multiply(Math.max(h.dot(hit.normal), 0) ** hit.object.getReflectionCoefficient());

      // Combine all the terms together in order to get the correct color!
      color = ambientTerm.add(diffuseTerm);
      color = color.add(specularTerm);
    }

    // Capp the color values to be maximum of 1.
    if (color.x > 1) color.x = 1;
    if (color.y > 1) color.y = 1;
    if (color.z > 1) color.z = 1;

    return color;
  }

  getClosestPoint(sceneObjects: SceneObject[]): Hit | null {
    let smallestT: number = Number.POSITIVE_INFINITY;
    let currentHit: Hit | null = null;
    let hitIndex: number | null = null;

    for (let i = 0; i < sceneObjects.length; i++) {
      const intersectionT = sceneObjects[i].getClosestPointOfIntesection(this);
      if (intersectionT !== null) {
        if (intersectionT < smallestT && intersectionT >= 0) {
          hitIndex = i;
          smallestT = intersectionT;
        }
      }
    }

    if (hitIndex !== null) {
      const vec3Hit: Vector3 = this.source.add(this.direction.multiply(smallestT));

      // We get and store the normal vector for the point.
      const dirNormal: Direction = sceneObjects[hitIndex].normal(vec3Hit);

      currentHit = new Hit(vec3Hit, this, smallestT, dirNormal, sceneObjects[hitIndex]);
      currentHit.setColorVEC(sceneObjects[hitIndex].color);
    }

    return currentHit;
  }
}

export class Hit extends Point {
  distance: number;
  t: number;
  object: SceneObject;
  normal: Direction;
  ray: Ray;

  get Point(): Point {
    return new Point(this.x, this.y, this.z);
  }

  constructor(point: Vector3, ray: Ray, t: number, normal: Direction, object: SceneObject) {
    super(point.x, point.y, point.z);
    this.ray = ray;
    this.t = t;
    this.object = object;
    this.normal = normal;

    // Calculate the distance of the Hit from the source
    this.distance = Math.sqrt(
      (point.x - ray.source.x) ** 2 + (point.y - ray.source.y) ** 2 + (point.z - ray.source.z) ** 2
    );
  }
}
