import { describe, it, expect } from 'vitest';
import { formatInTimeZone } from '../src/timezone';

describe('formatInTimeZone 时区格式化', () => {
  it('UTC 时刻转上海时间', () => {
    expect(formatInTimeZone('2026-08-14T12:00:00Z', 'Asia/Shanghai')).toBe('2026-08-14 20:00:00');
  });

  it('UTC 时刻转纽约时间（夏令时 UTC-4）', () => {
    expect(formatInTimeZone('2026-08-14T12:00:00Z', 'America/New_York')).toBe('2026-08-14 08:00:00');
  });

  it('自定义模板', () => {
    expect(formatInTimeZone('2026-08-14T12:00:00Z', 'Asia/Shanghai', 'YYYY年MM月DD日 HH:mm')).toBe('2026年08月14日 20:00');
  });

  it('非法时区名回退本地时区，不抛错', () => {
    expect(() => formatInTimeZone('2026-08-14T12:00:00Z', 'Not/AZone')).not.toThrow();
  });
});
