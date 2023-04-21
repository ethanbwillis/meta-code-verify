/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { exec } from 'child_process';

function genExec(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

const filesToFormat = new Set();

export default function rollupPrettierBuildStartPlugin(files) {
  filesToFormat.add(files);
  return {
    name: 'rollup-plugin-prettier-src-formatter',

    async buildStart(_options) {
      if (filesToFormat.size === 0) {
        return;
      }
      console.log('Running prettier for', Array.from(filesToFormat).join(' '));
      await genExec(
        `yarn run prettier ${Array.from(filesToFormat).join(' ')} --write`
      );
      filesToFormat.clear();
    },

    watchChange(_id, _change) {
      filesToFormat.add(files);
    },
  };
}
