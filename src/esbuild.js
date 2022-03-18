// this causes the actual Go/WASM vm to be created and initialized
import "./wasm_exec";
const CDK = require("cdk-web");
global.fs = CDK.require("fs");

export class EsBuild extends Go {
  wasm;
  workDir = "/app";
  user = "esbuild";
  homeDir = "/home/esbuild";

  constructor() {
    super();
    this.env.USER = this.user;
    this.env.HOME = this.homeDir;
    process.cwd = () => this.workDir;
  }

  async load() {
    const response = await fetch("esbuild.wasm");
    this.wasm = await response.arrayBuffer();
  }

  async command(args) {
    this.argv = ["esbuild", ...args];
    const res = await super.run(
      (await WebAssembly.instantiate(this.wasm, this.importObject)).instance
    );
    // Debug log to console
    return res;
  }
  /**
   *
   * @param {Object} args
   * @param {string[]} args.entryPoints
   * @param {string} args.outdir
   */
  async build(args) {
    return await this.command([...args.entryPoints, `--outdir=${args.outdir}`]);
  }
}
