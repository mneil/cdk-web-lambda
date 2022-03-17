if (window && !window.process) {
  window.process = require("process");
}
const fs = require("fs");
const CDK = require("cdk-web");

const cdk = CDK.require("aws-cdk-lib");
const lambda = CDK.require("aws-cdk-lib/aws-lambda");
const { WebLambda } = require("./src/lambda");
const app = new cdk.App();
const stack = new cdk.Stack(app, "BrowserStack");

const code = `\
function handler(event, context) {
  console.log(event);
}
`;

const package = {
  name: "sample-web-construct",
  version: "1.0.0",
  lockfileVersion: 2,
  requires: true,
  packages: {},
};

fs.mkdirSync("/app/lambda", { recursive: true });
fs.writeFileSync("/app/lambda/index.js", code);
fs.writeFileSync("/package-lock.json", JSON.stringify(package));

new WebLambda(stack, "Lambda", {
  entry: "/app/lambda/index.js",
  // code: lambda.Code.fromInline(`\
  // function handler(event, context) {
  //   console.log(event);
  // }
  // `),
  handler: "index.handler",
  runtime: lambda.Runtime.NODEJS_14_X,
});

const assembly = app.synth();

console.log(assembly.getStackArtifact("BrowserStack").template);
