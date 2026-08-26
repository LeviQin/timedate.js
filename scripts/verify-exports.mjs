import { createRequire } from 'node:module';
import { format, isValidTimeZone } from 'timedate.js';

const require = createRequire(import.meta.url);
const cjs = require('timedate.js');

if (format('2026-08-14', 'YYYY-MM-DD') !== '2026-08-14') {
  throw new Error('ESM package export is not usable');
}
if (cjs.format('2026-08-14', 'YYYY-MM-DD') !== '2026-08-14') {
  throw new Error('CJS package export is not usable');
}
if (!isValidTimeZone('Asia/Shanghai')) {
  throw new Error('Package export smoke check failed');
}

console.log('ESM/CJS package exports OK');
