// Load the go wasm.
require("./go-wasm");

class EsBuild extends Go {
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
    return await this.command([
      ...args.entryPoints,
      `--outdir=${args.outdir}`,
      ...(args.bundle ? ["--bundle"] : []), // "--bundle",
      ...(args.minify ? ["--minify"] : []), // "--minify",
      ...(args.sourcemap ? [`--sourcemap=${args.sourcemap}`] : []), // "--sourcemap=inline",
    ]);
  }
}
module.exports = { EsBuild };
