// ESM 命名导入（tree-shaking 友好）
import { format, addDays, diff, relativeTime, humanizeDuration, formatInTimeZone, startOf, endOf } from '../dist/index.js';
// 默认导入（兼容 v2 用法）
import timedate from '../dist/index.js';

console.log('--- 命名导入（新 API） ---');
console.log("format('2026-08-14', 'YYYY年MM月DD日 dddd'):", format('2026-08-14', 'YYYY年MM月DD日 dddd'));
console.log('addDays(2026-08-14, 7):', format(addDays('2026-08-14', 7), 'YYYY-MM-DD'));
console.log('diff 天数:', diff('2026-08-14', '2026-08-01', 'day'));
console.log('relativeTime:', relativeTime('2026-08-01'));
console.log('humanizeDuration(9_000_000):', humanizeDuration(9_000_000, { largest: 2 }));
console.log('formatInTimeZone:', formatInTimeZone('2026-08-14T12:00:00Z', 'Asia/Shanghai'));
console.log('startOf week:', format(startOf('2026-08-14', 'week'), 'YYYY-MM-DD dddd'));
console.log('endOf month:', format(endOf('2026-08-14', 'month'), 'YYYY-MM-DD HH:mm:ss'));

console.log('--- 默认导入（v2 兼容） ---');
console.log('getHour:', timedate.getHour('2019-12-30 14:00:00', '2020-01-01 14:00:00'));
console.log('transitionToSeconds(16:00:30):', timedate.transitionToSeconds('16:00:30'));
console.log('getFormat 周日 weekCN:', timedate.getFormat(new Date(2026, 7, 16)).weekCN);
console.log('dateDiff:', JSON.stringify(timedate.dateDiff('2019-12-13', '2019-12-15')));
