// const { EsBuild } = require("./esbuild");

onmessage = function ({ data }) {
  console.log("Message received from main script");
  const arr = new Int16Array(data);
  arr[0] = 2;
  // var workerResult = "Result: " + data[0] * data[1];
  console.log("Posting message back to main script");
  postMessage("updated");

  // new Promise(function (resolve, reject) {
  //   const esbuild = new EsBuild();
  //   esbuild.load().then(() => {
  //     esbuild
  //       .build({
  //         entryPoints: ["/app/lambda/index.js"],
  //         outdir: outputDir,
  //       })
  //       .then(() => {
  //         console.log("bundled");
  //         resolve();
  //       });
  //   });
  // });
};
