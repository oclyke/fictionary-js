/*
// This file is subject to the terms and conditions defined in
// file 'LICENSE.md', which is part of this source code package.
*/

/* eslint-disable no-console */

import production from './production';

type DebugType = 'verbose' | 'log' | 'warn' | 'error' | 'none';
type DebugLevel = DebugType | 'all';

const getDebugLVL = () => ((process.env.DEBUG_LVL) ? (process.env.DEBUG_LVL as DebugLevel) : 'log');
const debugLVL: DebugLevel = (production) ? 'none' : getDebugLVL();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebugFNType = (...args: any[]) => void;

const debugFNfactory = (level: DebugType): DebugFNType => {
  let fn = Function.prototype();

  // return do-nothing fn unless proper levels are set
  switch ((debugLVL as DebugLevel)) {
    case 'none':
      return fn;

    case 'error':
      // only error messages are shown
      if (level !== 'error') {
        return fn;
      }
      break;

    case 'warn':
      // errors and warnings are shown - logs and verbose are not
      if ((level === 'log') || (level === 'verbose')) {
        return fn;
      }
      break;

    case 'log':
      // errors, warnings and logs are shown - verbose are not
      if (level === 'verbose') {
        return fn;
      }
      break;

    default:
      // go to second pass
      break;
  }

  // assign a corresponding log function depending on level
  switch (level) {
    case 'error': fn = console.log; break;
    case 'warn': fn = console.warn; break;

    // fall-through
    case 'verbose':
    case 'log': fn = console.log;
      break;

    default:
  }
  return fn;
};

const debug = {
  error: debugFNfactory('error'),
  warn: debugFNfactory('warn'),
  log: debugFNfactory('log'),
  verbose: debugFNfactory('verbose'),
};

export default debug;
