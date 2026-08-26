import { describe, it, expect } from 'vitest';
import { format, formatFromParts, toParts } from '../src/format';
import { defineLocale, setLocale, getLocale } from '../src/i18n';

describe('format 模板格式化', () => {
  it('默认模板输出完整日期时间', () => {
    expect(format(new Date(2026, 7, 14, 9, 5, 3))).toBe('2026-08-14 09:05:03');
  });

  it('年月日中文模板 + 星期', () => {
    expect(format('2026-08-14', 'YYYY年MM月DD日 dddd')).toBe('2026年08月14日 星期五');
  });

  it('12 小时制与上午/下午', () => {
    expect(format('2026-08-14 15:30:00', 'hh:mm A')).toBe('03:30 下午');
    expect(format('2026-08-14 09:00:00', 'hh:mm A')).toBe('09:00 上午');
  });

  it('季度与毫秒', () => {
    expect(format('2026-08-14', 'Q季度 SSS毫秒')).toBe('3季度 000毫秒');
    expect(format('2026-08-14 00:00:00.456', 'S SS SSS')).toBe('4 45 456');
  });

  it('转义字符 [ ] 原样输出', () => {
    expect(format('2026-08-14', '[YYYY]年')).toBe('YYYY年');
  });

  it('未匹配 token 保留原样', () => {
    expect(format('2026-08-14', 'YYYY@x')).toBe('2026@x');
  });

  it('toParts 字段齐全', () => {
    const p = toParts(new Date(2026, 7, 14, 9, 5, 3, 456));
    expect(p).toEqual({
      year: 2026, month: 8, day: 14, hours: 9, minutes: 5, seconds: 3,
      milliseconds: 456, weekDay: 5, quarter: 3,
    });
  });

  it('formatFromParts 与 format 结果一致', () => {
    const p = toParts(new Date(2026, 7, 14));
    expect(formatFromParts(p, 'YYYY-MM-DD')).toBe('2026-08-14');
  });

  it('英文语言包', () => {
    setLocale('en');
    expect(format('2026-08-14', 'YYYY-MM-DD ddd')).toBe('2026-08-14 Fri');
    setLocale('zh');
    expect(format('2026-08-14', 'ddd', 'en')).toBe('Fri');
    expect(getLocale().name).toBe('zh');
  });

  it('支持注册自定义 locale', () => {
    defineLocale({
      name: 'test',
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekdaysShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      meridiem: ['AM', 'PM'],
      relativeTime: {
        future: (s) => `+${s}`,
        past: (s) => `-${s}`,
        templates: { s: 'sec', m: 'min', mm: '%d min', h: 'hour', hh: '%d hours', d: 'day', dd: '%d days', M: 'month', MM: '%d months', y: 'year', yy: '%d years' },
      },
      humanize: {
        year: () => 'y', month: () => 'mo', day: () => 'd', hour: () => 'h',
        minute: () => 'm', second: () => 's', ms: () => 'ms',
      },
    });
    expect(format('2026-08-14 15:00:00', 'ddd A', 'test')).toBe('Fr PM');
    expect(getLocale('test')?.name).toBe('test');
  });
});
