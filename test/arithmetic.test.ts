import { describe, it, expect } from 'vitest';
import {
  add, addDays, addMonths, addYears, subtractDays,
  startOf, endOf, diff, isBefore, isAfter, isSame,
  isSameOrBefore, isSameOrAfter, isBetween, clamp,
} from '../src/arithmetic';

describe('add / subtract（不可变）', () => {
  it('addDays 不修改原对象', () => {
    const src = new Date(2026, 7, 14);
    const out = addDays(src, 1);
    expect(out.getDate()).toBe(15);
    expect(src.getDate()).toBe(14);
  });

  it('月末裁剪：1月31日 + 1个月 = 2月28日', () => {
    expect(addMonths('2026-01-31', 1).getDate()).toBe(28);
  });

  it('闰年 2月29日 + 1年 = 2月28日', () => {
    const d = addYears('2024-02-29', 1);
    expect(d.getFullYear()).toBe(2025);
    expect(d.getDate()).toBe(28);
  });

  it('跨年计算', () => {
    expect(addDays('2025-12-31', 1).getFullYear()).toBe(2026);
  });

  it('subtractDays', () => {
    expect(subtractDays('2026-08-14', 7).getDate()).toBe(7);
  });

  it('add 通用单位', () => {
    expect(add('2026-08-14T10:00:00', 90, 'minute').getHours()).toBe(11);
    expect(add('2026-08-14', 2, 'quarter').getMonth()).toBe(1); // 8月+2季 = 次年2月
  });
});

describe('startOf / endOf', () => {
  it('startOf day', () => {
    const d = startOf('2026-08-14 15:30:45', 'day');
    expect(d.getHours()).toBe(0);
    expect(d.getSeconds()).toBe(0);
  });

  it('startOf week 以周一为起点', () => {
    expect(startOf('2026-08-14', 'week').getDate()).toBe(10); // 2026-08-10 周一
    expect(startOf('2026-08-16', 'week').getDate()).toBe(10); // 周日也归本周一
  });

  it('startOf month / year', () => {
    expect(startOf('2026-08-14', 'month').getDate()).toBe(1);
    expect(startOf('2026-08-14', 'year').getMonth()).toBe(0);
    expect(startOf('2026-08-14', 'year').getDate()).toBe(1);
  });

  it('endOf day 为 23:59:59.999', () => {
    const d = endOf('2026-08-14', 'day');
    expect(d.getHours()).toBe(23);
    expect(d.getMilliseconds()).toBe(999);
  });

  it('endOf month 为月末最后一刻', () => {
    const d = endOf('2026-08-14', 'month');
    expect(d.getDate()).toBe(31);
    expect(d.getHours()).toBe(23);
  });
});

describe('diff', () => {
  it('day 差值（UTC 日历差，规避夏令时）', () => {
    expect(diff('2026-08-14', '2026-08-01', 'day')).toBe(13);
    expect(diff('2026-08-01', '2026-08-14', 'day')).toBe(-13);
  });

  it('month / year 用真实日历差', () => {
    expect(diff('2026-03-15', '2026-01-15', 'month')).toBe(2);
    expect(diff('2026-03-01', '2026-01-15', 'month')).toBe(1);
    expect(diff('2028-08-14', '2026-08-14', 'year')).toBe(2);
  });

  it('小时/分钟差值', () => {
    expect(diff('2026-08-14 12:00:00', '2026-08-14 10:30:00', 'hour')).toBe(1); // trunc
    expect(diff('2026-08-14 12:00:00', '2026-08-14 10:30:00', 'minute')).toBe(90);
  });

  it('round 参数', () => {
    expect(diff('2026-08-14 12:00:00', '2026-08-14 10:30:00', 'hour', 'round')).toBe(2);
    expect(diff('2026-08-14 12:00:00', '2026-08-14 10:30:00', 'hour', 'ceil')).toBe(2);
  });
});

describe('比较函数', () => {
  it('isBefore / isAfter', () => {
    expect(isBefore('2026-08-01', '2026-08-14')).toBe(true);
    expect(isAfter('2026-08-14', '2026-08-01')).toBe(true);
  });

  it('isSame 按单位', () => {
    expect(isSame('2026-08-14 10:00:00', '2026-08-14 20:00:00', 'day')).toBe(true);
    expect(isSame('2026-08-14 10:00:00', '2026-08-15 20:00:00', 'day')).toBe(false);
    expect(isSame('2026-08-14', '2026-08-14', 'ms')).toBe(true);
  });

  it('isSameOrBefore / isSameOrAfter', () => {
    expect(isSameOrBefore('2026-08-14', '2026-08-14')).toBe(true);
    expect(isSameOrAfter('2026-08-14', '2026-08-14')).toBe(true);
  });

  it('isBetween 默认包含两端', () => {
    expect(isBetween('2026-08-14', '2026-08-01', '2026-08-31')).toBe(true);
    expect(isBetween('2026-08-01', '2026-08-01', '2026-08-31')).toBe(true);
    expect(isBetween('2026-09-01', '2026-08-01', '2026-08-31')).toBe(false);
  });

  it('isBetween 排除边界', () => {
    expect(isBetween('2026-08-01', '2026-08-01', '2026-08-31', false)).toBe(false);
    expect(isBetween('2026-08-01', '2026-08-01', '2026-08-31', { start: false, end: true })).toBe(false);
  });

  it('clamp 钳制区间', () => {
    expect(clamp('2026-01-01', '2026-06-01', '2026-12-31').getMonth()).toBe(5);
    expect(clamp('2027-01-01', '2026-06-01', '2026-12-31').getFullYear()).toBe(2026);
    expect(clamp('2026-08-14', '2026-06-01', '2026-12-31').getDate()).toBe(14);
  });
});
