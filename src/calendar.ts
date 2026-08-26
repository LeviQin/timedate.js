import type { DateInput } from './types';
import { toDate } from './parse';

/**
 * 判断是否为闰年：能被 4 整除但不能被 100 整除，或能被 400 整除
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** 某年某月的天数，month 为 1-12 */
export function daysInMonth(year: number, month: number): number {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return 0;
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
}

/** 获取季度（1-4） */
export function getQuarter(input: DateInput): number {
  return Math.floor(toDate(input).getMonth() / 3) + 1;
}

/** 一年中的第几天（1-366） */
export function getDayOfYear(input: DateInput): number {
  const d = toDate(input);
  if (Number.isNaN(d.getTime())) return NaN;
  const start = createUTCDate(d.getFullYear(), 0, 1).getTime();
  const current = createUTCDate(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((current - start) / 86_400_000) + 1;
}

/** ISO 8601 周数（1-53），基于 ISO 周四法则 */
export function getISOWeek(input: DateInput): number {
  const d = toDate(input);
  if (Number.isNaN(d.getTime())) return NaN;
  const utcDate = createUTCDate(d.getFullYear(), d.getMonth(), d.getDate());
  const day = utcDate.getUTCDay() || 7; // 周一 = 1
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = createUTCDate(utcDate.getUTCFullYear(), 0, 1).getTime();
  return Math.ceil(((utcDate.getTime() - yearStart) / 86_400_000 + 1) / 7);
}

function createUTCDate(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setUTCFullYear(year, month, day);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/**
 * 生成月历网格（6 行 × 7 列），用于日历组件渲染。
 * 首尾行包含上月末 / 下月初的占位日期。
 * @param year 年份
 * @param month 月份 1-12
 * @param weekStart 每周起始日，0 = 周日，1 = 周一，默认 1
 */
export function getMonthGrid(year: number, month: number, weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): Date[][] {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('month must be an integer between 1 and 12');
  }
  const first = createLocalDate(year, month - 1, 1);
  const offset = (first.getDay() - weekStart + 7) % 7;
  const start = createLocalDate(year, month - 1, 1 - offset);
  const weeks: Date[][] = [];
  for (let i = 0; i < 6; i++) {
    const row: Date[] = [];
    for (let j = 0; j < 7; j++) {
      row.push(createLocalDate(start.getFullYear(), start.getMonth(), start.getDate() + i * 7 + j));
    }
    weeks.push(row);
  }
  return weeks;
}

function createLocalDate(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setFullYear(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}
