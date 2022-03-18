const CDK = require("cdk-web");
const path = CDK.require("path");
const fs = CDK.require("fs");
const cdk = CDK.require("aws-cdk-lib");
const { WebAsset } = require("./asset");

class Bundling {
  /**
   * esbuild bundled Lambda asset code
   *
   * @param {(AssetOptions | BundlingOptions)} options
   */
  static bundle(options) {
    return new WebAsset(options.projectRoot, {
      assetHash: options.assetHash,
      assetHashType: options.assetHash
        ? cdk.AssetHashType.CUSTOM
        : cdk.AssetHashType.OUTPUT,
      bundling: new Bundling(options),
    });
  }

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
    //this.props = props;
    // if (!props.esbuild) {
    //   throw new Error("esbuild required for asset bundling");
    // }
    // Docker bundling
    this.image = new cdk.DockerImage("noop");
    this.local = this.getLocalBundlingProvider(props.esbuild);
    this.outputType = cdk.BundlingOutput.ARCHIVED;
  }

  getLocalBundlingProvider(esbuild) {
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
        console.log("TRYING TO BUNDLE", esbuild);
        fs.writeFileSync(path.resolve(outputDir, "out.zip"));
        esbuild
          .build({ entryPoints: ["/app/lambda/index.js"], outdir: outputDir })
          .then(console.log);
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
