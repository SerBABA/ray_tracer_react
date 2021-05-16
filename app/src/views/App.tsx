import React, { Fragment } from "react";
import { useState } from "react";
import ViewPlane from "../comps/ViewPlane";
import { Point } from "../helpers/Vector3";
import "./../styling/App.css";

// Constants
const X_SIZE_DEFAULT: number = 200;
const Y_SIZE_DEFAULT: number = 200;
const EDIST = 400;
const LIGHT_POS = new Point(100, 100, -200);
LIGHT_POS.setColor(1, 1, 1);

// Types
export type GridSizeType = {
  x_size: number;
  y_size: number;
};

function App() {
  // keeps track of the grid size.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gridSize, _setGridSize] = useState<GridSizeType>({
    x_size: X_SIZE_DEFAULT,
    y_size: Y_SIZE_DEFAULT,
  });

  return (
    <Fragment>
      <main>
        <ViewPlane gridSize={gridSize} eyeDist={EDIST} lightPos={LIGHT_POS} />
      </main>
    </Fragment>
  );
}

export default App;
