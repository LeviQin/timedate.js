/**
 * timedate.js v3 — 零依赖的现代日期时间工具库
 * 命名导出（推荐，tree-shaking 友好）+ 默认导出（兼容 v2 用法）
 */
export * from './types';
export { toDate, parse, isValid } from './parse';
export { format, toParts, formatFromParts } from './format';
export {
  add, subtract,
  addMilliseconds, addSeconds, addMinutes, addHours, addDays, addWeeks, addMonths, addYears,
  subtractMilliseconds, subtractSeconds, subtractMinutes, subtractHours,
  subtractDays, subtractWeeks, subtractMonths, subtractYears,
  startOf, endOf, diff,
  isBefore, isAfter, isSame, isSameOrBefore, isSameOrAfter, isBetween, clamp,
} from './arithmetic';
export type { BetweenInclusive } from './arithmetic';
export { isLeapYear, daysInMonth, getQuarter, getDayOfYear, getISOWeek, getMonthGrid } from './calendar';
export { relativeTime, humanizeDuration } from './relative';
export type { HumanizeOptions } from './relative';
export { formatInTimeZone } from './timezone';
export { validateTimeFormat } from './validate';
export { setLocale, getLocale } from './i18n';
export type { Locale, RelativeTemplate } from './locale-types';
export { getHour, transitionToSeconds, dateFormat, removeHMS, dateDiff, getFormat, getCurrentWeekDates } from './legacy';

import { toDate, parse, isValid } from './parse';
import { format, toParts, formatFromParts } from './format';
import {
  add, subtract,
  addMilliseconds, addSeconds, addMinutes, addHours, addDays, addWeeks, addMonths, addYears,
  subtractMilliseconds, subtractSeconds, subtractMinutes, subtractHours,
  subtractDays, subtractWeeks, subtractMonths, subtractYears,
  startOf, endOf, diff,
  isBefore, isAfter, isSame, isSameOrBefore, isSameOrAfter, isBetween, clamp,
} from './arithmetic';
import { isLeapYear, daysInMonth, getQuarter, getDayOfYear, getISOWeek, getMonthGrid } from './calendar';
import { relativeTime, humanizeDuration } from './relative';
import { formatInTimeZone } from './timezone';
import { validateTimeFormat } from './validate';
import { setLocale, getLocale } from './i18n';
import {
  getHour, transitionToSeconds, dateFormat, removeHMS, dateDiff, getFormat, getCurrentWeekDates,
} from './legacy';

/** 兼容 v2 的默认导出对象：timedate.xxx(...) */
const timedate = {
  // legacy v2 API（bug 修复后）
  getHour,
  transitionToSeconds,
  dateFormat,
  removeHMS,
  dateDiff,
  getFormat,
  isLeapYear,
  getCurrentWeekDates,
  validateTimeFormat,
  // v3 新 API
  parse,
  toDate,
  isValid,
  format,
  toParts,
  formatFromParts,
  add,
  subtract,
  addMilliseconds,
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subtractMilliseconds,
  subtractSeconds,
  subtractMinutes,
  subtractHours,
  subtractDays,
  subtractWeeks,
  subtractMonths,
  subtractYears,
  startOf,
  endOf,
  diff,
  isBefore,
  isAfter,
  isSame,
  isSameOrBefore,
  isSameOrAfter,
  isBetween,
  clamp,
  daysInMonth,
  getQuarter,
  getDayOfYear,
  getISOWeek,
  getMonthGrid,
  relativeTime,
  humanizeDuration,
  formatInTimeZone,
  setLocale,
  getLocale,
};

export default timedate;
