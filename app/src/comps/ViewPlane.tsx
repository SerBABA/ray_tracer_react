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
const sphere1 = new SphereObject(new Point(0, 0, -90), 70);
sphere1.setColor(1, 0.2, 1);
const SCENE_OBJECTS: SceneObject[] = [sphere1];

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
