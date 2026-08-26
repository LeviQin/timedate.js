/**
 * 兼容层：保留 timedate.js v2 的全部 9 个 API（修复历史 bug），签名与返回值不变。
 */
import type { DateInput } from './types';
import { toDate, isValid } from './parse';
import { toParts, formatFromParts } from './format';
import { isLeapYear } from './calendar';
import { startOf, endOf } from './arithmetic';
import { validateTimeFormat } from './validate';

/** v2 bug 修复：数组补上"星期六"，周日（week=7）不再越界 */
const CN_WEEK_COMPAT = ['default', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

const fmtDate = (d: Date) => formatFromParts(toParts(d), 'YYYY-MM-DD');
const fmtTime = (d: Date) => formatFromParts(toParts(d), 'HH:mm:ss');

/**
 * 计算两个时间之间的小时差（向下取整）
 * 支持 'YYYY-MM-DD HH:mm:ss' 或 'HH:mm:ss'（缺日期补当天）
 * @deprecated 使用 diff(time1, time2, 'hour')。
 */
export function getHour(time1: string, time2: string): number {
  const d1 = toDate(time1);
  const d2 = toDate(time2);
  return Math.floor((d2.getTime() - d1.getTime()) / 3_600_000);
}

/**
 * 获取一个时间的总秒数，支持 'HH:mm' 与 'HH:mm:ss'
 * v2 bug 修复：原来只解析前两段，秒会被静默丢弃
 * @deprecated 使用 parse 或自定义时间输入处理。
 */
export function transitionToSeconds(timeString: string): number {
  const m = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(String(timeString).trim());
  if (!m) return NaN;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + (m[3] ? Number(m[3]) : 0);
}

const DATE_FORMAT_KEYS = ['ymdhms', 'ymdhm', 'ymd', 'md', 'hms', 'hm', 'ymdhmsCN', 'ymdCN', 'mdCN'] as const;

/**
 * 日期格式化，返回包含多种格式的对象（无效输入返回原始值，保持 v2 行为）
 * @deprecated 使用 format() 按需格式化。
 */
export function dateFormat(inputDate: DateInput): Record<(typeof DATE_FORMAT_KEYS)[number], string | DateInput> {
  const d = toDate(inputDate);
  if (!isValid(d)) {
    const out = {} as Record<(typeof DATE_FORMAT_KEYS)[number], string | DateInput>;
    for (const k of DATE_FORMAT_KEYS) out[k] = inputDate;
    return out;
  }
  const p = toParts(d);
  return {
    ymdhms: formatFromParts(p, 'YYYY-MM-DD HH:mm:ss'),
    ymdhm: formatFromParts(p, 'YYYY-MM-DD HH:mm'),
    ymd: formatFromParts(p, 'YYYY-MM-DD'),
    md: formatFromParts(p, 'MM-DD'),
    hms: formatFromParts(p, 'HH:mm:ss'),
    hm: formatFromParts(p, 'HH:mm'),
    ymdhmsCN: formatFromParts(p, 'YYYY年MM月DD日 HH:mm:ss'),
    ymdCN: formatFromParts(p, 'YYYY年MM月DD日'),
    mdCN: formatFromParts(p, 'MM月DD日'),
  };
}

/** 日期去除时分秒，返回 'YYYY-MM-DD'。@deprecated 使用 format(input, 'YYYY-MM-DD')。 */
export function removeHMS(dateString: string): string {
  const d = toDate(dateString);
  return isValid(d) ? fmtDate(d) : '';
}

/**
 * 返回两个日期相差的天数
 * v2 修复：改用 Date.UTC 计算，规避夏令时导致的 ±1 天误差
 * @returns { days, daysCA } days 不含今天；daysCA 含今天
 * @deprecated 使用 diff(date1, date2, 'day')。
 */
export function dateDiff(date1: DateInput, date2: DateInput): { days: number; daysCA: number } {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  const days = Math.abs(Math.round((utc2 - utc1) / 86_400_000));
  return { days, daysCA: days + 1 };
}

/**
 * 获取一个日期的所有信息（week: 1-7，周日为 7，保持 v2 语义）
 * @deprecated 使用 toParts() 和 format()。
 */
export function getFormat(date: DateInput): Record<string, string | number> {
  const myDate = toDate(date);
  const year = myDate.getFullYear();
  const month = myDate.getMonth() + 1;
  const day = myDate.getDate();
  let week = myDate.getDay();
  if (week === 0) week = 7;
  const hours = myDate.getHours();
  const minutes = myDate.getMinutes();
  const seconds = myDate.getSeconds();
  const milliseconds = myDate.getMilliseconds();
  return {
    year,
    yearCN: year + '年',
    month,
    monthCN: month + '月',
    day,
    dayCN: day + '日',
    week,
    weekCN: CN_WEEK_COMPAT[week] ?? '',
    time: myDate.getTime(),
    hours,
    hoursCN: hours + '小时',
    minutes,
    minutesCN: minutes + '分钟',
    seconds,
    secondsCN: seconds + '秒',
    milliseconds,
    millisecondsCN: milliseconds + '毫秒',
  };
}

/** 获取当前周的起始（周一）和结束（周日）日期。@deprecated 使用 startOf(now, 'week') 和 endOf(now, 'week')。 */
export function getCurrentWeekDates(): { start: string; end: string } {
  const now = new Date();
  return {
    start: fmtDate(startOf(now, 'week')),
    end: fmtDate(endOf(now, 'week')),
  };
}

export { isLeapYear, validateTimeFormat };
