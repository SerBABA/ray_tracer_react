const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

function run(x_size, y_size) {
  if (isMainThread) {
    let newArray = [];
    let x;
    let y;
    // initializing array
    for (var j = 0; j < x_size * y_size; j++) {
      newArray.push("");
    }

    // Processing
    for (var i = 0; i < x_size * y_size; i++) {
      x = i % x_size;
      y = (i - x) / y_size;

      const worker = new Worker("./service.js", {
        workerData: {
          x,
          y,
          index: i,
        },
      });

      worker.on("message", ({ index, color }) => {
        newArray[index] = color;
      });
    }
  } else {
    const pixel = workerData;
    parentPort.postMessage({ index: pixel.index, color: `rgb(${pixel.x}, ${pixel.y}, 0)` });
  }
}
if (isMainThread) {
  console.time("multi");
  // run(100, 100);
  console.timeEnd("multi");

  console.time("single");
  let newArray = [];
  let x;
  let y;
  for (var i = 0; i < 500 * 500; i++) {
    x = i % 500;
    y = (i - x) / 500;
    newArray.push(`rgb(${x}, ${y}, 0)`);
  }
  console.timeEnd("single");
}
