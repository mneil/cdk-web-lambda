const CDK = require("cdk-web");
const path = CDK.require("path");
const fs = CDK.require("fs");
const cdk = CDK.require("aws-cdk-lib");
const { EsBuild } = require("./esbuild");
const workerFile = require("!raw-loader!./bundle-worker.js");
const { WebAsset } = require("./asset");

class Bundling {
  /**
   * esbuild bundled Lambda asset code
   *
   * @param {(AssetOptions | BundlingOptions)} options
   */
  static async bundle(options) {
    const bundling = new Bundling(options);
    await bundling.init();
    return new WebAsset(options.projectRoot, {
      assetHash: options.assetHash,
      assetHashType: options.assetHash
        ? cdk.AssetHashType.CUSTOM
        : cdk.AssetHashType.OUTPUT,
      bundling,
    });
  }

  _stageDir;
  image;
  command;
  entrypoint;
  environment;
  local;
  outputType;
  securityOpt;
  volumes;
  workingDirectory;

  constructor(props) {
    // Docker bundling
    this.image = new cdk.DockerImage("noop");
    this.outputType = cdk.BundlingOutput.ARCHIVED;
    this.local = this.getLocalBundlingProvider();
  }

  async init() {
    fs.mkdirSync("/tmp/web-bundle", { recursive: true });
    this._stageDir = fs.mkdtempSync("/tmp/web-bundle/");
    await new Promise((resolve, reject) => {
      const esbuild = new EsBuild();
      esbuild.load().then(() => {
        esbuild
          .build({
            entryPoints: ["/app/lambda/index.js"],
            outdir: this._stageDir,
          })
          .then(() => {
            console.log("bundled");
            resolve();
          });
      });
    });
  }

  getLocalBundlingProvider() {
    // const osPlatform = os.platform();
    // const createLocalCommand = (outputDir, esbuild, tsc) =>
    //   this.createBundlingCommand({
    //     inputDir: this.projectRoot,
    //     outputDir,
    //     esbuildRunner: esbuild.isLocal
    //       ? this.packageManager.runBinCommand("esbuild")
    //       : "esbuild",
    //     tscRunner:
    //       tsc &&
    //       (tsc.isLocal ? this.packageManager.runBinCommand("tsc") : "tsc"),
    //     osPlatform,
    //   });
    // const environment = this.props.environment || {};
    // const cwd = this.projectRoot;

    return {
      tryBundle(outputDir, options) {
        console.log("TRYING TO BUNDLE");
        fs.writeFileSync(path.resolve(outputDir, "out.zip"));

        // TODO: Copy files over

        // esbuild
        //   .initialize({
        //     wasmURL: "/esbuild.wasm",
        //   })
        //   .then(() => {
        //     console.log("loaded the bundle");
        //     // esbuild.transform(code, options).then(result => { ... })
        //     // esbuild.build(options).then(result => { ... })
        //   });
        // if (!Bundling.esbuildInstallation) {
        //   process.stderr.write(
        //     "esbuild cannot run locally. Switching to Docker bundling.\n"
        //   );
        //   return false;
        // }

        // if (
        //   !Bundling.esbuildInstallation.version.startsWith(
        //     `${ESBUILD_MAJOR_VERSION}.`
        //   )
        // ) {
        //   throw new Error(
        //     `Expected esbuild version ${ESBUILD_MAJOR_VERSION}.x but got ${Bundling.esbuildInstallation.version}`
        //   );
        // }

        // const localCommand = createLocalCommand(
        //   outputDir,
        //   Bundling.esbuildInstallation,
        //   Bundling.tscInstallation
        // );

        // exec(
        //   osPlatform === "win32" ? "cmd" : "bash",
        //   [osPlatform === "win32" ? "/c" : "-c", localCommand],
        //   {
        //     env: { ...process.env, ...environment },
        //     stdio: [
        //       // show output
        //       "ignore", // ignore stdio
        //       process.stderr, // redirect stdout to stderr
        //       "inherit", // inherit stderr
        //     ],
        //     cwd,
        //     windowsVerbatimArguments: osPlatform === "win32",
        //   }
        // );

        return true;
      },
    };
  }
}

module.exports = {
  Bundling,
};
