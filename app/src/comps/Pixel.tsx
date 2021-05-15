import React from "react";
import { SceneObject } from "../helpers/Objects";
import { Ray } from "../helpers/Ray";
import { Point, Vector3, Direction } from "../helpers/Vector3";

type PixelProps = {
  x: number;
  y: number;
  eyeDist: number;
  width: number;
  height: number;
  viewSource: Point;
  ambientColor: Vector3;
  lightPos: Point;
  sceneObjects: SceneObject[];
};

export type Coords = {
  x: number;
  y: number;
};

function getTestColorGradient(x: number, y: number, x_size: number, y_size: number) {
  return `rgb(${(x / x_size) * 255}, ${(y / y_size) * 255}, 0)`;
}

export function getPixelCoordinates(index: number, x_size: number, y_size: number) {
  let x: number;

  // getting the x coordinate of the pixel
  x = index % x_size;

  // store this inside a coords object
  return {
    x,
    y: y_size - 1 - (index - x) / y_size,
  };
}

function Pixel(props: PixelProps) {
  // Building the ray origin
  const pixelPoint: Point = new Point(
    props.x - props.width / 2 + 0.5,
    props.y - props.height / 2 + 0.5,
    -props.eyeDist
  );

  // Build the ray direction
  const temp = pixelPoint.minus(props.viewSource);
  const rayDirection: Direction = new Direction(temp.x, temp.y, temp.z);
  rayDirection.normalize();

  // Firing the ray and gettting the colour
  const traceRay: Ray = new Ray(props.viewSource, rayDirection, 1);
  const color = traceRay.trace(props.sceneObjects, props.ambientColor, props.lightPos);

  return (
    <div
      style={{
        backgroundColor: `rgb(${color.x * 255}, ${color.y * 255}, ${color.z * 255})`,
        width: "100%",
        height: "100%",
      }}
    ></div>
  );
}

export default Pixel;
