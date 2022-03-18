#! bash -eux

__filename=$(readlink -f "$0")
__dirname=$(dirname "$__filename")
__root=$(dirname "$__dirname")

pushd $__root
  pushd node_modules/esbuild-wasm
    # go get
    # GOOS=js GOARCH=wasm go build -o ../../public/main.wasm
    cp esbuild.wasm ../../public/esbuild.wasm
    # sed 's/require(/__webpack_require__(/g' \
    #   "lib/main.js" > $__root/src/esbuild.js
    # sed -i 's/__webpack_require__("pnpapi");/throw new Error();/g' \
    #   $__root/src/esbuild.js

    sed -i 's/require = require/require = __webpack_require__/g' \
      $__root/src/wasm_exec.js
  popd
popd
