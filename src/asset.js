const CDK = require("cdk-web");
const cdk = CDK.require("aws-cdk-lib");
const { fs } = require("./fs");
const { AssetCode } = CDK.require("aws-cdk-lib/aws-lambda");

cdk.AssetStaging.prototype.bundle = function bundle(options, bundleDir) {
  if (fs.existsSync(bundleDir)) {
    return;
  }
  fs.mkdirSync(bundleDir, { recursive: true });
  let localBundling;
  try {
    console.log(`Bundling asset ${this.node.path}... in ${bundleDir}\n`);

    localBundling = options.local?.tryBundle(bundleDir, options);
    if (!localBundling) {
      throw new Error(
        `Only local bundling is supported. Pass a local bundler to ${this.node.path}`
      );
    }
  } catch (err) {
    // When bundling fails, keep the bundle output for diagnosability, but
    // rename it out of the way so that the next run doesn't assume it has a
    // valid bundleDir.
    const bundleErrorDir = bundleDir + "-error";
    if (fs.existsSync(bundleErrorDir)) {
      // Remove the last bundleErrorDir.
      fs.removeSync(bundleErrorDir);
    }

    fs.renameSync(bundleDir, bundleErrorDir);
    throw new Error(
      `Failed to bundle asset ${this.node.path}, bundle output is located at ${bundleErrorDir}: ${err}`
    );
  }

  if (fs.readdirSync(bundleDir) === []) {
    const outputDir = localBundling
      ? bundleDir
      : AssetStaging.BUNDLING_OUTPUT_DIR;
    throw new Error(
      `Bundling did not produce any output. Check that content is written to ${outputDir}.`
    );
  }
};

class WebAsset extends AssetCode {}

module.exports = {
  WebAsset,
};
