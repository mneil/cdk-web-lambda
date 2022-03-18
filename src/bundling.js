const CDK = require("cdk-web");
const path = CDK.require("path");
const fs = CDK.require("fs");
const cdk = CDK.require("aws-cdk-lib");
const { WebAsset } = require("./asset");
// const { Code } = CDK.require("aws-cdk-lib/aws-lambda");

// const ESBUILD_MAJOR_VERSION = "0";

// const orgSync = fs.ensureDirSync;
// fs.ensureDirSync = function (dir) {
//   debugger;
//   return orgSync(dir);
// };

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
    this.props = props;

    // Docker bundling
    this.image = new cdk.DockerImage("noop");
    this.local = this.getLocalBundlingProvider();
    this.outputType = cdk.BundlingOutput.ARCHIVED;
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

// const { PackageInstallation } = require("./package-installation");
// const { PackageManager } = require("./package-manager");
// const {
//   exec,
//   extractDependencies,
//   findUp,
//   getTsconfigCompilerOptions,
// } = require("./util");

// const ESBUILD_MAJOR_VERSION = "0";

// /**
//  * Output format for the generated JavaScript files
//  */
// const OutputFormat = {
//   /**
//    * CommonJS
//    */
//   CJS: "cjs",

//   /**
//    * ECMAScript module
//    *
//    * Requires a running environment that supports `import` and `export` syntax.
//    */
//   ESM: "esm",
// };

// /**
//  * SourceMap mode for esbuild
//  * @see https://esbuild.github.io/api/#sourcemap
//  */
// const SourceMapMode = {
//   /**
//    * Default sourceMap mode - will generate a .js.map file alongside any generated .js file and add a special //# sourceMappingURL=
//    * comment to the bottom of the .js file pointing to the .js.map file
//    */
//   DEFAULT: "default",
//   /**
//    *  External sourceMap mode - If you want to omit the special //# sourceMappingURL= comment from the generated .js file but you still
//    *  want to generate the .js.map files
//    */
//   EXTERNA: "external",
//   /**
//    * Inline sourceMap mode - If you want to insert the entire source map into the .js file instead of generating a separate .js.map file
//    */
//   INLINE: "inline",
//   /**
//    * Both sourceMap mode - If you want to have the effect of both inline and external simultaneously
//    */
//   BOTH: "both",
// };

// /**
//  * Bundling with esbuild
//  */
// class Bundling {
//   /**
//    * esbuild bundled Lambda asset code
//    */
//   static bundle(options) {
//     return Code.fromAsset(options.projectRoot, {
//       assetHash: options.assetHash,
//       assetHashType: options.assetHash
//         ? cdk.AssetHashType.CUSTOM
//         : cdk.AssetHashType.OUTPUT,
//       bundling: new Bundling(options),
//     });
//   }

//   static clearEsbuildInstallationCache() {
//     this.esbuildInstallation = undefined;
//   }

//   static clearTscInstallationCache() {
//     this.tscInstallation = undefined;
//   }

//   static esbuildInstallation;
//   static tscInstallation;

//   // Core bundling options
//   image;
//   command;
//   environment;
//   workingDirectory;
//   local;

//   projectRoot;
//   relativeEntryPath;
//   relativeTsconfigPath;
//   relativeDepsLockFilePath;
//   externals;
//   packageManager;

//   constructor(props) {
//     this.props = props;
//     this.packageManager = PackageManager.fromLockFile(
//       props.depsLockFilePath,
//       props.logLevel
//     );

//     Bundling.esbuildInstallation =
//       Bundling.esbuildInstallation || PackageInstallation.detect("esbuild");
//     Bundling.tscInstallation =
//       Bundling.tscInstallation || PackageInstallation.detect("typescript");

//     this.projectRoot = props.projectRoot;
//     this.relativeEntryPath = path.relative(
//       this.projectRoot,
//       path.resolve(props.entry)
//     );
//     this.relativeDepsLockFilePath = path.relative(
//       this.projectRoot,
//       path.resolve(props.depsLockFilePath)
//     );

//     if (this.relativeDepsLockFilePath.includes("..")) {
//       throw new Error(
//         `Expected depsLockFilePath: ${props.depsLockFilePath} to be under projectRoot: ${this.projectRoot} (${this.relativeDepsLockFilePath})`
//       );
//     }

//     if (props.tsconfig) {
//       this.relativeTsconfigPath = path.relative(
//         this.projectRoot,
//         path.resolve(props.tsconfig)
//       );
//     }

//     if (props.preCompilation && !/\.tsx?$/.test(props.entry)) {
//       throw new Error("preCompilation can only be used with typescript files");
//     }

//     if (
//       props.format === OutputFormat.ESM &&
//       (props.runtime === Runtime.NODEJS_10_X ||
//         props.runtime === Runtime.NODEJS_12_X)
//     ) {
//       throw new Error(
//         `ECMAScript module output format is not supported by the ${props.runtime.name} runtime`
//       );
//     }

//     this.externals = [
//       ...(props.externalModules || ["aws-sdk"]), // Mark aws-sdk as external by default (available in the runtime)
//       ...(props.nodeModules || []), // Mark the modules that we are going to install as externals also
//     ];

//     // Docker bundling
//     const shouldBuildImage =
//       props.forceDockerBundling || !Bundling.esbuildInstallation;
//     this.image = shouldBuildImage
//       ? props.dockerImage
//       : cdk.DockerImage.fromBuild(path.join(__dirname, "../lib"), {
//           buildArgs: {
//             ...(props.buildArgs || {}),
//             IMAGE: props.runtime.bundlingImage.image,
//             ESBUILD_VERSION: props.esbuildVersion || ESBUILD_MAJOR_VERSION,
//           },
//           platform: props.architecture.dockerPlatform,
//         }).fromRegistry("dummy"); // Do not build if we don't need to

//     const bundlingCommand = this.createBundlingCommand({
//       inputDir: cdk.AssetStaging.BUNDLING_INPUT_DIR,
//       outputDir: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
//       esbuildRunner: "esbuild", // esbuild is installed globally in the docker image
//       tscRunner: "tsc", // tsc is installed globally in the docker image
//       osPlatform: "linux", // linux docker image
//     });
//     this.command = ["bash", "-c", bundlingCommand];
//     this.environment = props.environment;
//     // Bundling sets the working directory to cdk.AssetStaging.BUNDLING_INPUT_DIR
//     // and we want to force npx to use the globally installed esbuild.
//     this.workingDirectory = "/";

//     // Local bundling
//     if (!props.forceDockerBundling) {
//       // only if Docker is not forced
//       this.local = this.getLocalBundlingProvider();
//     }
//   }

//   createBundlingCommand(options) {
//     const pathJoin = osPathJoin(options.osPlatform);
//     let relativeEntryPath = pathJoin(options.inputDir, this.relativeEntryPath);
//     let tscCommand = "";

//     if (this.props.preCompilation) {
//       const tsconfig =
//         this.props.tsconfig ||
//         findUp("tsconfig.json", path.dirname(this.props.entry));
//       if (!tsconfig) {
//         throw new Error(
//           "Cannot find a `tsconfig.json` but `preCompilation` is set to `true`, please specify it via `tsconfig`"
//         );
//       }
//       const compilerOptions = getTsconfigCompilerOptions(tsconfig);
//       tscCommand = `${options.tscRunner} "${relativeEntryPath}" ${compilerOptions}`;
//       relativeEntryPath = relativeEntryPath.replace(/\.ts(x?)$/, ".js$1");
//     }

//     const loaders = Object.entries(this.props.loader || {});
//     const defines = Object.entries(this.props.define || {});

//     if (this.props.sourceMap === false && this.props.sourceMapMode) {
//       throw new Error("sourceMapMode cannot be used when sourceMap is false");
//     }

//     const sourceMapEnabled = this.props.sourceMapMode || this.props.sourceMap;
//     const sourceMapMode = this.props.sourceMapMode || SourceMapMode.DEFAULT;
//     const sourceMapValue =
//       sourceMapMode === SourceMapMode.DEFAULT
//         ? ""
//         : `=${this.props.sourceMapMode}`;
//     const sourcesContent = this.props.sourcesContent || true;

//     const outFile =
//       this.props.format === OutputFormat.ESM ? "index.mjs" : "index.js";
//     const esbuildCommand = [
//       options.esbuildRunner,
//       "--bundle",
//       `"${relativeEntryPath}"`,
//       `--target=${this.props.target || toTarget(this.props.runtime)}`,
//       "--platform=node",
//       ...(this.props.format ? [`--format=${this.props.format}`] : []),
//       `--outfile="${pathJoin(options.outputDir, outFile)}"`,
//       ...(this.props.minify ? ["--minify"] : []),
//       ...(sourceMapEnabled ? [`--sourcemap${sourceMapValue}`] : []),
//       ...(sourcesContent ? [] : [`--sources-content=${sourcesContent}`]),
//       ...this.externals.map((external) => `--external:${external}`),
//       ...loaders.map(([ext, name]) => `--loader:${ext}=${name}`),
//       ...defines.map(
//         ([key, value]) => `--define:${key}=${JSON.stringify(value)}`
//       ),
//       ...(this.props.logLevel ? [`--log-level=${this.props.logLevel}`] : []),
//       ...(this.props.keepNames ? ["--keep-names"] : []),
//       ...(this.relativeTsconfigPath
//         ? [
//             `--tsconfig=${pathJoin(
//               options.inputDir,
//               this.relativeTsconfigPath
//             )}`,
//           ]
//         : []),
//       ...(this.props.metafile
//         ? [`--metafile=${pathJoin(options.outputDir, "index.meta.json")}`]
//         : []),
//       ...(this.props.banner
//         ? [`--banner:js=${JSON.stringify(this.props.banner)}`]
//         : []),
//       ...(this.props.footer
//         ? [`--footer:js=${JSON.stringify(this.props.footer)}`]
//         : []),
//       ...(this.props.charset ? [`--charset=${this.props.charset}`] : []),
//       ...(this.props.mainFields
//         ? [`--main-fields=${this.props.mainFields.join(",")}`]
//         : []),
//       ...(this.props.inject
//         ? this.props.inject.map((i) => `--inject:${i}`)
//         : []),
//       ...(this.props.esbuildArgs ? [toCliArgs(this.props.esbuildArgs)] : []),
//     ];

//     let depsCommand = "";
//     if (this.props.nodeModules) {
//       // Find 'package.json' closest to entry folder, we are going to extract the
//       // modules versions from it.
//       const pkgPath = findUp("package.json", path.dirname(this.props.entry));
//       if (!pkgPath) {
//         throw new Error(
//           "Cannot find a `package.json` in this project. Using `nodeModules` requires a `package.json`."
//         );
//       }

//       // Determine dependencies versions, lock file and installer
//       const dependencies = extractDependencies(pkgPath, this.props.nodeModules);
//       const osCommand = new OsCommand(options.osPlatform);

//       const lockFilePath = pathJoin(
//         options.inputDir,
//         this.relativeDepsLockFilePath || this.packageManager.lockFile
//       );

//       // Create dummy package.json, copy lock file if any and then install
//       depsCommand = chain([
//         osCommand.writeJson(pathJoin(options.outputDir, "package.json"), {
//           dependencies,
//         }),
//         osCommand.copy(
//           lockFilePath,
//           pathJoin(options.outputDir, this.packageManager.lockFile)
//         ),
//         osCommand.changeDirectory(options.outputDir),
//         this.packageManager.installCommand.join(" "),
//       ]);
//     }

//     return chain([
//       ...(this.props.commandHooks?.beforeBundling(
//         options.inputDir,
//         options.outputDir
//       ) || []),
//       tscCommand,
//       esbuildCommand.join(" "),
//       ...((this.props.nodeModules &&
//         this.props.commandHooks?.beforeInstall(
//           options.inputDir,
//           options.outputDir
//         )) ||
//         []),
//       depsCommand,
//       ...(this.props.commandHooks?.afterBundling(
//         options.inputDir,
//         options.outputDir
//       ) || []),
//     ]);
//   }

//   getLocalBundlingProvider() {
//     const osPlatform = os.platform();
//     const createLocalCommand = (outputDir, esbuild, tsc) =>
//       this.createBundlingCommand({
//         inputDir: this.projectRoot,
//         outputDir,
//         esbuildRunner: esbuild.isLocal
//           ? this.packageManager.runBinCommand("esbuild")
//           : "esbuild",
//         tscRunner:
//           tsc &&
//           (tsc.isLocal ? this.packageManager.runBinCommand("tsc") : "tsc"),
//         osPlatform,
//       });
//     const environment = this.props.environment || {};
//     const cwd = this.projectRoot;

//     return {
//       tryBundle(outputDir) {
//         if (!Bundling.esbuildInstallation) {
//           process.stderr.write(
//             "esbuild cannot run locally. Switching to Docker bundling.\n"
//           );
//           return false;
//         }

//         if (
//           !Bundling.esbuildInstallation.version.startsWith(
//             `${ESBUILD_MAJOR_VERSION}.`
//           )
//         ) {
//           throw new Error(
//             `Expected esbuild version ${ESBUILD_MAJOR_VERSION}.x but got ${Bundling.esbuildInstallation.version}`
//           );
//         }

//         const localCommand = createLocalCommand(
//           outputDir,
//           Bundling.esbuildInstallation,
//           Bundling.tscInstallation
//         );

//         exec(
//           osPlatform === "win32" ? "cmd" : "bash",
//           [osPlatform === "win32" ? "/c" : "-c", localCommand],
//           {
//             env: { ...process.env, ...environment },
//             stdio: [
//               // show output
//               "ignore", // ignore stdio
//               process.stderr, // redirect stdout to stderr
//               "inherit", // inherit stderr
//             ],
//             cwd,
//             windowsVerbatimArguments: osPlatform === "win32",
//           }
//         );

//         return true;
//       },
//     };
//   }
// }

// /**
//  * OS agnostic command
//  */
// class OsCommand {
//   constructor(osPlatform) {}

//   writeJson(filePath, data) {
//     const stringifiedData = JSON.stringify(data);
//     if (this.osPlatform === "win32") {
//       return `echo ^${stringifiedData}^ > "${filePath}"`;
//     }

//     return `echo '${stringifiedData}' > "${filePath}"`;
//   }

//   copy(src, dest) {
//     if (this.osPlatform === "win32") {
//       return `copy "${src}" "${dest}"`;
//     }

//     return `cp "${src}" "${dest}"`;
//   }

//   changeDirectory(dir) {
//     return `cd "${dir}"`;
//   }
// }

// /**
//  * Chain commands
//  */
// function chain(commands) {
//   return commands.filter((c) => !!c).join(" && ");
// }

// /**
//  * Platform specific path join
//  */
// function osPathJoin(platform) {
//   return function (...paths) {
//     const joined = path.join(...paths);
//     // If we are on win32 but need posix style paths
//     if (os.platform() === "win32" && platform !== "win32") {
//       return joined.replace(/\\/g, "/");
//     }
//     return joined;
//   };
// }

// /**
//  * Converts a runtime to an esbuild node target
//  */
// function toTarget(runtime) {
//   const match = runtime.name.match(/nodejs(\d+)/);

//   if (!match) {
//     throw new Error("Cannot extract version from runtime.");
//   }

//   return `node${match[1]}`;
// }

// function toCliArgs(esbuildArgs) {
//   const args = [];

//   for (const [key, value] of Object.entries(esbuildArgs)) {
//     if (value === true || value === "") {
//       args.push(key);
//     } else if (value) {
//       args.push(`${key}="${value}"`);
//     }
//   }

//   return args.join(" ");
// }

module.exports = {
  Bundling,
};
