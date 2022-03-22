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
const lib = require('./lib');
module.exports = function handler(event, context) {
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
  process.cwd = () => "/app";
  fs.mkdirSync("/app/lambda", { recursive: true });
  fs.writeFileSync("/app/lambda/lib.js", lib);
  fs.writeFileSync("/app/lambda/index.js", code);
  fs.writeFileSync("/app/package-lock.json", JSON.stringify(packageLock));
  fs.writeFileSync("/app/package.json", JSON.stringify(package));

  await WebLambda.fromWeb(stack, "Lambda", {
    entry: "/app/lambda/index.js",
  });
  const assembly = app.synth();
  console.log(assembly.getStackArtifact("BrowserStack").template);
}
synth();
