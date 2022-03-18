// const path = require("path");

const LockFile = {
  NPM: "package-lock.json",
  YARN: "yarn.lock",
  PNPM: "pnpm-lock.yaml",
};

// /**
//  * A node package manager
//  */
// class PackageManager {
//   /**
//    * Use a lock file path to determine the package manager to use. Optionally, specify a log level to
//    * control its verbosity.
//    * @param lockFilePath Path of the lock file
//    * @param logLevel optional log level @default LogLevel.INFO
//    * @returns the right PackageManager for that lock file
//    */
//   static fromLockFile(lockFilePath, logLevel) {
//     const lockFile = path.basename(lockFilePath);

//     switch (lockFile) {
//       case LockFile.YARN:
//         return new PackageManager({
//           lockFile: LockFile.YARN,
//           installCommand:
//             logLevel && logLevel !== LogLevel.INFO
//               ? ["yarn", "install", "--no-immutable", "--silent"]
//               : ["yarn", "install", "--no-immutable"],
//           runCommand: ["yarn", "run"],
//         });
//       case LockFile.PNPM:
//         return new PackageManager({
//           lockFile: LockFile.PNPM,
//           installCommand:
//             logLevel && logLevel !== LogLevel.INFO
//               ? ["pnpm", "install", "--reporter", "silent"]
//               : ["pnpm", "install"],
//           runCommand: ["pnpm", "exec"],
//           argsSeparator: "--",
//         });
//       default:
//         return new PackageManager({
//           lockFile: LockFile.NPM,
//           installCommand: logLevel
//             ? ["npm", "ci", "--loglevel", logLevel]
//             : ["npm", "ci"],
//           runCommand: ["npx", "--no-install"],
//         });
//     }
//   }

//   lockFile;
//   installCommand;
//   runCommand;
//   argsSeparator;

//   constructor(props) {
//     this.lockFile = props.lockFile;
//     this.installCommand = props.installCommand;
//     this.runCommand = props.runCommand;
//     this.argsSeparator = props.argsSeparator;
//   }

//   runBinCommand(bin) {
//     const [runCommand, ...runArgs] = this.runCommand;
//     return [
//       os.platform() === "win32" ? `${runCommand}.cmd` : runCommand,
//       ...runArgs,
//       ...(this.argsSeparator ? [this.argsSeparator] : []),
//       bin,
//     ].join(" ");
//   }
// }

module.exports = {
  LockFile,
  // PackageManager,
};
