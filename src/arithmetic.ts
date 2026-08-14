import type { AddUnit, DateInput, DiffUnit, RoundType, StartOfUnit } from './types';
import { toDate } from './parse';
import { daysInMonth } from './calendar';

const MS_PER = { ms: 1, second: 1000, minute: 60_000, hour: 3_600_000, day: 86_400_000, week: 604_800_000 };

function roundValue(v: number, round: RoundType): number {
  switch (round) {
    case 'floor': return Math.floor(v);
    case 'ceil': return Math.ceil(v);
    case 'round': return Math.round(v);
    case 'trunc': return Math.trunc(v);
  }
}

/**
 * 增量计算（不可变，返回新 Date）
 * month/quarter/year 的加法会做月末裁剪（1月31日 + 1个月 = 2月28/29日）
 */
export function add(input: DateInput, amount: number, unit: AddUnit): Date {
  const d = toDate(input);
  switch (unit) {
    case 'ms': d.setMilliseconds(d.getMilliseconds() + amount); break;
    case 'second': d.setSeconds(d.getSeconds() + amount); break;
    case 'minute': d.setMinutes(d.getMinutes() + amount); break;
    case 'hour': d.setHours(d.getHours() + amount); break;
    case 'day': d.setDate(d.getDate() + amount); break;
    case 'week': d.setDate(d.getDate() + amount * 7); break;
    case 'month': addMonthsSafe(d, amount); break;
    case 'quarter': addMonthsSafe(d, amount * 3); break;
    case 'year': addMonthsSafe(d, amount * 12); break;
  }
  return d;
}

function addMonthsSafe(d: Date, months: number) {
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  d.setDate(Math.min(day, daysInMonth(d.getFullYear(), d.getMonth() + 1)));
}

/** 减量计算（不可变），等价于 add(input, -amount, unit) */
export function subtract(input: DateInput, amount: number, unit: AddUnit): Date {
  return add(input, -amount, unit);
}

export const addMilliseconds = (input: DateInput, n: number) => add(input, n, 'ms');
export const addSeconds = (input: DateInput, n: number) => add(input, n, 'second');
export const addMinutes = (input: DateInput, n: number) => add(input, n, 'minute');
export const addHours = (input: DateInput, n: number) => add(input, n, 'hour');
export const addDays = (input: DateInput, n: number) => add(input, n, 'day');
export const addWeeks = (input: DateInput, n: number) => add(input, n, 'week');
export const addMonths = (input: DateInput, n: number) => add(input, n, 'month');
export const addYears = (input: DateInput, n: number) => add(input, n, 'year');

export const subtractMilliseconds = (input: DateInput, n: number) => add(input, -n, 'ms');
export const subtractSeconds = (input: DateInput, n: number) => add(input, -n, 'second');
export const subtractMinutes = (input: DateInput, n: number) => add(input, -n, 'minute');
export const subtractHours = (input: DateInput, n: number) => add(input, -n, 'hour');
export const subtractDays = (input: DateInput, n: number) => add(input, -n, 'day');
export const subtractWeeks = (input: DateInput, n: number) => add(input, -n, 'week');
export const subtractMonths = (input: DateInput, n: number) => add(input, -n, 'month');
export const subtractYears = (input: DateInput, n: number) => add(input, -n, 'year');

/** 取单位起始时刻（不可变）。week 以周一为一周开始 */
export function startOf(input: DateInput, unit: StartOfUnit): Date {
  const d = toDate(input);
  switch (unit) {
    case 'second': d.setMilliseconds(0); break;
    case 'minute': d.setSeconds(0, 0); break;
    case 'hour': d.setMinutes(0, 0, 0); break;
    case 'day': d.setHours(0, 0, 0, 0); break;
    case 'week': {
      const offset = (d.getDay() + 6) % 7; // 周一为 0
      d.setDate(d.getDate() - offset);
      d.setHours(0, 0, 0, 0);
      break;
    }
    case 'month': d.setDate(1); d.setHours(0, 0, 0, 0); break;
    case 'quarter': {
      const m = d.getMonth() - (d.getMonth() % 3);
      d.setMonth(m, 1);
      d.setHours(0, 0, 0, 0);
      break;
    }
    case 'year': d.setMonth(0, 1); d.setHours(0, 0, 0, 0); break;
  }
  return d;
}

const NEXT_UNIT: Record<StartOfUnit, StartOfUnit> = {
  second: 'minute',
  minute: 'hour',
  hour: 'day',
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'quarter',
  year: 'year',
};

/** 取单位末尾时刻（不可变），如 endOf('month') = 月末 23:59:59.999 */
export function endOf(input: DateInput, unit: StartOfUnit): Date {
  const next = NEXT_UNIT[unit];
  return new Date(startOf(add(input, 1, next), next).getTime() - 1);
}

/**
 * 计算 date1 - date2 的差值
 * day/week 使用 UTC 日历差（规避夏令时）；month/quarter/year 使用真实日历差
 * @param round 取整方式，默认 'trunc'（向零截断）
 */
export function diff(date1: DateInput, date2: DateInput, unit: DiffUnit = 'ms', round: RoundType = 'trunc'): number {
  const a = toDate(date1);
  const b = toDate(date2);

  if (unit === 'month' || unit === 'quarter' || unit === 'year') {
    const diffMonths = (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());
    const months = a.getDate() < b.getDate() ? diffMonths - 1 : diffMonths;
    if (unit === 'month') return months;
    if (unit === 'quarter') return roundValue(months / 3, round);
    return roundValue(months / 12, round);
  }

  if (unit === 'day' || unit === 'week') {
    const utc = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const dayDiff = (utc(a) - utc(b)) / MS_PER.day;
    return unit === 'day' ? roundValue(dayDiff, round) : roundValue(dayDiff / 7, round);
  }

  const v = (a.getTime() - b.getTime()) / MS_PER[unit];
  return roundValue(v, round);
}

export function isBefore(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() < toDate(b).getTime();
}

export function isAfter(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() > toDate(b).getTime();
}

/** 判断两个日期是否属于同一单位区间 */
export function isSame(a: DateInput, b: DateInput, unit: StartOfUnit | 'ms' = 'ms'): boolean {
  if (unit === 'ms') return toDate(a).getTime() === toDate(b).getTime();
  return startOf(a, unit).getTime() === startOf(b, unit).getTime();
}

export function isSameOrBefore(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() <= toDate(b).getTime();
}

export function isSameOrAfter(a: DateInput, b: DateInput): boolean {
  return toDate(a).getTime() >= toDate(b).getTime();
}

export interface BetweenInclusive {
  start?: boolean;
  end?: boolean;
}

/** 判断日期是否在 [start, end] 区间内，默认包含两端 */
export function isBetween(
  input: DateInput,
  start: DateInput,
  end: DateInput,
  inclusive: boolean | BetweenInclusive = true,
): boolean {
  const d = toDate(input).getTime();
  const s = toDate(start).getTime();
  const e = toDate(end).getTime();
  const inc: BetweenInclusive = typeof inclusive === 'boolean' ? { start: inclusive, end: inclusive } : inclusive;
  const gt = inc.start === false ? d > s : d >= s;
  const lt = inc.end === false ? d < e : d <= e;
  return gt && lt;
}

/** 将日期钳制到 [min, max] 区间（不可变） */
export function clamp(input: DateInput, min: DateInput, max: DateInput): Date {
  const d = toDate(input);
  const minT = toDate(min).getTime();
  const maxT = toDate(max).getTime();
  if (d.getTime() < minT) return new Date(minT);
  if (d.getTime() > maxT) return new Date(maxT);
  return d;
}
