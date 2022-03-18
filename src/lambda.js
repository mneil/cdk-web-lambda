// this is our actual construct. this is both node and browser compatible.
// for browser you can run "npx webpack" and grab the output "bundle.js".
// for nodejs, you can require(".../index.js") of this package as usual.

const CDK = require("cdk-web");
const fs = CDK.require("fs");
const path = CDK.require("path");
const lambda = CDK.require("aws-cdk-lib/aws-lambda");
const { Bundling } = require("./bundling");
const { LockFile } = require("./package-manager");
const { callsites, findUpMultiple } = require("./util");

class WebLambda extends lambda.Function {
  constructor(scope, id, props) {
    // Entry and defaults
    const entry = path.resolve(findEntry(id, props.entry));
    // const entry = props.entry || "/app/lambda/index.js";
    const handler = props.handler || "handler";
    const runtime = lambda.Runtime.NODEJS_14_X;
    const architecture = props.architecture || lambda.Architecture.X86_64;
    const depsLockFilePath = findLockFile(props.depsLockFilePath);
    const projectRoot = props.projectRoot || path.dirname(depsLockFilePath);

    super(scope, id, {
      ...props,
      runtime,
      code: Bundling.bundle({
        // assetHash: "abc",
        ...(props.bundling || {}),
        entry,
        runtime,
        architecture,
        depsLockFilePath,
        projectRoot,
      }),
      handler: `index.${handler}`,
    });

    // Enable connection reuse for aws-sdk
    if (props.awsSdkConnectionReuse ?? true) {
      this.addEnvironment("AWS_NODEJS_CONNECTION_REUSE_ENABLED", "1", {
        removeInEdge: true,
      });
    }
  }
}

/**
 * Checks given lock file or searches for a lock file
 */
function findLockFile(depsLockFilePath) {
  if (depsLockFilePath) {
    if (!fs.existsSync(depsLockFilePath)) {
      throw new Error(`Lock file at ${depsLockFilePath} doesn't exist`);
    }

    if (!fs.statSync(depsLockFilePath).isFile()) {
      throw new Error("`depsLockFilePath` should point to a file");
    }

    return path.resolve(depsLockFilePath);
  }

  const lockFiles = findUpMultiple([
    LockFile.PNPM,
    LockFile.YARN,
    LockFile.NPM,
  ]);

  if (lockFiles.length === 0) {
    throw new Error(
      "Cannot find a package lock file (`pnpm-lock.yaml`, `yarn.lock` or `package-lock.json`). Please specify it with `depsFileLockPath`."
    );
  }
  if (lockFiles.length > 1) {
    throw new Error(
      `Multiple package lock files found: ${lockFiles.join(
        ", "
      )}. Please specify the desired one with \`depsFileLockPath\`.`
    );
  }

  return lockFiles[0];
}

function findEntry(id, entry) {
  if (entry) {
    if (!/\.(jsx?|tsx?|mjs)$/.test(entry)) {
      throw new Error(
        "Only JavaScript or TypeScript entry files are supported."
      );
    }
    if (!fs.existsSync(entry)) {
      throw new Error(`Cannot find entry file at ${entry}`);
    }
    return entry;
  }

  const definingFile = findDefiningFile();
  const extname = path.extname(definingFile);

  const tsHandlerFile = definingFile.replace(
    new RegExp(`${extname}$`),
    `.${id}.ts`
  );
  if (fs.existsSync(tsHandlerFile)) {
    return tsHandlerFile;
  }

  const jsHandlerFile = definingFile.replace(
    new RegExp(`${extname}$`),
    `.${id}.js`
  );
  if (fs.existsSync(jsHandlerFile)) {
    return jsHandlerFile;
  }

  const mjsHandlerFile = definingFile.replace(
    new RegExp(`${extname}$`),
    `.${id}.mjs`
  );
  if (fs.existsSync(mjsHandlerFile)) {
    return mjsHandlerFile;
  }

  throw new Error(
    `Cannot find handler file ${tsHandlerFile}, ${jsHandlerFile} or ${mjsHandlerFile}`
  );
}

/**
 * Finds the name of the file where the `NodejsFunction` is defined
 */
function findDefiningFile() {
  let definingIndex;
  const sites = callsites();
  for (const [index, site] of sites.entries()) {
    if (site.getFunctionName() === "NodejsFunction") {
      // The next site is the site where the NodejsFunction was created
      definingIndex = index + 1;
      break;
    }
  }

  if (!definingIndex || !sites[definingIndex]) {
    throw new Error("Cannot find defining file.");
  }

  return sites[definingIndex].getFileName();
}

module.exports = {
  WebLambda,
};
