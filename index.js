if (window && !window.process) {
  window.process = require("process");
}
const CDK = require("cdk-web");
// const fs = CDK.require("fs");
const { fs } = require("./src/fs");
const cdk = CDK.require("aws-cdk-lib");
const { WebLambda } = require("./src");
const app = new cdk.App();
const stack = new cdk.Stack(app, "BrowserStack");

const lib = `\
export const lib = 'some value'
`;

const code = `\
import * as lib from './lib';
function handler(event, context) {
  console.log(event, lib);
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

// have to build the lambda

async function synth() {
  fs.mkdirSync("/app/lambda", { recursive: true });
  fs.writeFileSync("/app/lambda/lib.js", lib);
  fs.writeFileSync("/app/lambda/index.js", code);
  fs.writeFileSync("/package-lock.json", JSON.stringify(packageLock));
  fs.writeFileSync("/package.json", JSON.stringify(package));

  await WebLambda.fromWeb(stack, "Lambda", {
    entry: "/app/lambda/index.js",
  });
  const assembly = app.synth();
  console.log(assembly.getStackArtifact("BrowserStack").template);
}
synth();
