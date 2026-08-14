import { describe, it, expect } from 'vitest';
import { isLeapYear, daysInMonth, getQuarter, getDayOfYear, getISOWeek, getMonthGrid } from '../src/calendar';

describe('日历工具', () => {
  it('isLeapYear', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2026)).toBe(false);
  });

  it('daysInMonth', () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 8)).toBe(31);
    expect(daysInMonth(2026, 4)).toBe(30);
  });

  it('getQuarter', () => {
    expect(getQuarter('2026-02-14')).toBe(1);
    expect(getQuarter('2026-05-14')).toBe(2);
    expect(getQuarter('2026-08-14')).toBe(3);
    expect(getQuarter('2026-11-14')).toBe(4);
  });

  it('getDayOfYear', () => {
    expect(getDayOfYear('2026-01-01')).toBe(1);
    expect(getDayOfYear('2026-02-01')).toBe(32);
    expect(getDayOfYear('2026-12-31')).toBe(365);
  });

  it('getISOWeek（ISO 周四法则）', () => {
    expect(getISOWeek('2026-01-01')).toBe(1);
    expect(getISOWeek('2026-08-14')).toBe(33);
  });

  it('getMonthGrid 6 行 × 7 列，首尾含占位日期', () => {
    const grid = getMonthGrid(2026, 8, 1); // 2026-08-01 是周六
    expect(grid.length).toBe(6);
    expect(grid[0]!.length).toBe(7);
    // 第一格是 7 月 27 日（周一占位）
    expect(grid[0]![0]!.getMonth()).toBe(6);
    expect(grid[0]![0]!.getDate()).toBe(27);
    // 行首均为周一
    for (const row of grid) {
      expect(row[0]!.getDay()).toBe(1);
    }
  });
});
