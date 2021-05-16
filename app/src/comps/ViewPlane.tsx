import React, { Fragment, useEffect, useState } from "react";
import { GridSizeType } from "../views/App";
import Pixel, { Coords, getPixelCoordinates } from "./Pixel";
import { SceneObject, SphereObject } from "../helpers/Objects";
import { Point, Vector3 } from "../helpers/Vector3";

// Types
export type ViewPlaneProps = {
  gridSize: GridSizeType;
  eyeDist: number;
  lightPos: Point;
};

// Constants
const sphere1 = new SphereObject(new Point(0, 0, -350), 50);
sphere1.setColor(1, 0.2, 1);

const sphere2 = new SphereObject(new Point(40, 40, -280), 15);
sphere2.setColor(0.2, 1, 1);

const sphere3 = new SphereObject(new Point(30, -30, -280), 22);
sphere3.setColor(0, 0, 1);

const sphere4 = new SphereObject(new Point(-30, -40, -280), 22);
sphere4.setColor(0.5, 1, 0);

const SCENE_OBJECTS: SceneObject[] = [sphere1, sphere2, sphere3, sphere4];

function ViewPlane(props: ViewPlaneProps) {
  const [grideState, setGrideState] = useState<Coords[]>([]);

  useEffect(() => {
    let newGridState: Coords[] = [];
    for (var i = 0; i < props.gridSize.x_size * props.gridSize.y_size; i++) {
      newGridState.push(getPixelCoordinates(i, props.gridSize.x_size, props.gridSize.y_size));
    }

    setGrideState(newGridState);
  }, [props.gridSize.x_size, props.gridSize.y_size]);

  return (
    <Fragment>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${props.gridSize.x_size}, 1fr)`,
          height: `100vh`,
          width: `100vh`,
        }}
      >
        {grideState.map((data, index) => {
          return (
            <Pixel
              key={index}
              x={data.x}
              y={data.y}
              eyeDist={props.eyeDist}
              width={props.gridSize.x_size}
              height={props.gridSize.y_size}
              viewSource={new Point(0, 0, 0)}
              ambientColor={new Vector3(0.2, 0.2, 0.2)}
              lightPos={props.lightPos}
              sceneObjects={SCENE_OBJECTS}
            />
          );
        })}
      </section>
    </Fragment>
  );
}

export default ViewPlane;
