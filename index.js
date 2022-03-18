if (window && !window.process) {
  window.process = require("process");
}
const CDK = require("cdk-web");
const fs = CDK.require("fs");
const cdk = CDK.require("aws-cdk-lib");
const { WebLambda } = require("./src/lambda");
// const esbuild = require("./src/esbuild");
const { EsBuild } = require("./src/esbuild");
require("./src/wasm_exec");

const app = new cdk.App();
const stack = new cdk.Stack(app, "BrowserStack");

const code = `\
function handler(event, context) {
  console.log(event);
}
`;

const package = {};
const packageLock = {
  name: "sample-web-construct",
  version: "1.0.0",
  lockfileVersion: 2,
  requires: true,
  packages: {},
};

fs.mkdirSync("/app/lambda", { recursive: true });
fs.writeFileSync("/app/lambda/index.js", code);
fs.writeFileSync("/package-lock.json", JSON.stringify(packageLock));
fs.writeFileSync("/package.json", JSON.stringify(package));

const esbuild = new EsBuild();
esbuild.load().then(() => {
  new WebLambda(stack, "Lambda", {
    esbuild,
    entry: "/app/lambda/index.js",
  });

  const assembly = app.synth();
  console.log(assembly.getStackArtifact("BrowserStack").template);
});

// esbuild
//   .initialize({
//     wasmURL: "/esbuild.wasm",
//   })
//   .then(() => {
//     new WebLambda(stack, "Lambda", {
//       esbuild,
//       entry: "/app/lambda/index.js",
//     });

//     const assembly = app.synth();
//     console.log(assembly.getStackArtifact("BrowserStack").template);
//   });
