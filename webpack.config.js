const path = require("path");

module.exports = (env, argv) => {
  return {
    node: { global: true },
    mode: "development",
    entry: "./index.js",
    ...(argv.mode === "production"
      ? {
          optimization: {
            minimize: false,
          },
        }
      : { devtool: "inline-source-map" }),
    output: {
      path: path.join(__dirname, "dist"),
      filename: "cdk-web-lambda.js",
      library: {
        name: "cdk-web-lambda",
        type: "umd",
      },
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
    externals: {
      ...(argv.mode === "production"
        ? {
            "cdk-web": "CDK",
          }
        : {}),
    },
    performance: {
      hints: false,
    },
    resolve: {
      alias: {
        "cdk-web": path.resolve(__dirname, "utils/browser-cdk.js"),
        "aws-sdk": path.resolve(__dirname, "utils/browser-aws.js"),
        fs: "memfs",
        esbuild: "esbuild-wasm",
      },
      fallback: {
        process: require.resolve("process/browser"),
        assert: require.resolve("assert/"),
        util: require.resolve("util/"),
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
        os: require.resolve("os-browserify/browser"),
        crypto: require.resolve("crypto-browserify"),
        zlib: require.resolve("browserify-zlib"),
      },
    },
    devServer: {
      static: [
        { directory: path.join(__dirname, "public") },
        { directory: path.join(__dirname, "node_modules/aws-sdk/dist") },
        { directory: path.join(__dirname, "node_modules/cdk-web/dist") },
      ],
      compress: true,
      port: 9000,
    },
  };
};
