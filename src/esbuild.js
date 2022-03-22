// Load the go wasm. This is the basic loader and will use the
// first defined class. Comment out this require to use the
// official esbuild browser wasm loader.
require("./go-wasm");

try {
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
} catch (e) {
  const esbuild = require("./browser-wasm");
  class EsBuild {
    wasm;
    workDir = "/app";
    user = "esbuild";
    homeDir = "/home/esbuild";

    constructor() {
      // this.env.USER = this.user;
      // this.env.HOME = this.homeDir;
      process.cwd = () => this.workDir;
    }

    async load() {
      await esbuild.initialize({
        wasmURL: "esbuild.wasm",
        worker: false,
      });
      this.wasm = esbuild;
    }
    /**
     *
     * @param {Object} args
     * @param {string[]} args.entryPoints
     * @param {string} args.outdir
     */
    async build(args) {
      return await this.wasm.build(args);
    }
  }
  module.exports = { EsBuild };
}
