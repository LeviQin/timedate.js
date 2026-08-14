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
  return new Date(year, month, 0).getDate();
}

/** 获取季度（1-4） */
export function getQuarter(input: DateInput): number {
  return Math.floor(toDate(input).getMonth() / 3) + 1;
}

/** 一年中的第几天（1-366） */
export function getDayOfYear(input: DateInput): number {
  const d = toDate(input);
  const start = new Date(d.getFullYear(), 0, 0).getTime();
  return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - start) / 86_400_000);
}

/** ISO 8601 周数（1-53），基于 ISO 周四法则 */
export function getISOWeek(input: DateInput): number {
  const d = toDate(input);
  const day = (d.getDay() + 6) % 7; // 周一 = 0
  const thursday = new Date(d);
  thursday.setDate(d.getDate() - day + 3);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  firstThursday.setDate(firstThursday.getDate() - (((firstThursday.getDay() + 6) % 7)) + 3);
  return 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / 604_800_000);
}

/**
 * 生成月历网格（6 行 × 7 列），用于日历组件渲染。
 * 首尾行包含上月末 / 下月初的占位日期。
 * @param year 年份
 * @param month 月份 1-12
 * @param weekStart 每周起始日，0 = 周日，1 = 周一，默认 1
 */
export function getMonthGrid(year: number, month: number, weekStart: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): Date[][] {
  const first = new Date(year, month - 1, 1);
  const offset = (first.getDay() - weekStart + 7) % 7;
  const start = new Date(year, month - 1, 1 - offset);
  const weeks: Date[][] = [];
  for (let i = 0; i < 6; i++) {
    const row: Date[] = [];
    for (let j = 0; j < 7; j++) {
      row.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i * 7 + j));
    }
    weeks.push(row);
  }
  return weeks;
}
