import { describe, it, expect } from 'vitest';
import { format, formatInTimeZone, humanizeDuration, relativeTime } from '../src/index';
import { getLocale, setLocale } from '../src/i18n';

describe('无效输入和 locale 边界', () => {
  it('日期相关格式化函数返回明确错误值', () => {
    expect(format('not-a-date')).toBe('Invalid Date');
    expect(relativeTime('not-a-date', '2026-08-14')).toBe('Invalid Date');
    expect(formatInTimeZone('not-a-date', 'Asia/Shanghai')).toBe('Invalid Date');
  });

  it('无效 duration 返回明确错误值', () => {
    expect(humanizeDuration(Number.NaN)).toBe('Invalid Duration');
    expect(humanizeDuration(Number.POSITIVE_INFINITY)).toBe('Invalid Duration');
  });

  it('locale 名称不会命中对象原型链', () => {
    expect(setLocale('toString')).toBe(false);
    expect(getLocale('toString')).toBeUndefined();
    expect(format('2026-08-14', 'YYYY-MM-DD')).toBe('2026-08-14');
    setLocale('zh');
  });
});
