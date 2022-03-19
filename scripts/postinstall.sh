#! bash -eux

__filename=$(readlink -f "$0")
__dirname=$(dirname "$__filename")
__root=$(dirname "$__dirname")

pushd $__root
  pushd node_modules/esbuild-wasm

    cp esbuild.wasm ../../public/esbuild.wasm

    # Try the browser wasm executor
    sed 's/global.require = require/global.require = __webpack_require__/g' \
      "lib/browser.js" > $__root/src/browser-wasm.js
    sed -i '1s#^#global.fs = require("./fs").fs;\n#' \
      $__root/src/browser-wasm.js


    # Try the basic go wasm executor
    sed 's/global.require = require/global.require = __webpack_require__/g' \
      "wasm_exec.js" > $__root/src/go-wasm.js
    sed -i '1s#^#global.fs = require("./fs").fs;\n#' \
      $__root/src/go-wasm.js
  popd
popd
