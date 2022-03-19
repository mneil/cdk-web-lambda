const CDK = require("cdk-web");
const { WasmFs } = require("@wasmer/wasmfs");

// const wasmfs = new WasmFs();
const wasmfs = CDK.require("fs");

module.exports = {
  ...wasmfs,
};
