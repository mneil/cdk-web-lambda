import { tryGetModuleVersionFromRequire } from "./util";

/**
 * Package installation
 */
export class PackageInstallation {
  static detect(module) {
    // Check local version first
    const version = tryGetModuleVersionFromRequire(module);
    if (version) {
      return {
        isLocal: true,
        version,
      };
    }
  }

  isLocal;
  version;
}
