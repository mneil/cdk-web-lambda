const CDK = require("cdk-web");

const wasmfs = CDK.require("fs");

module.exports = {
  ...wasmfs,
};
