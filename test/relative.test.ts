import { describe, it, expect } from 'vitest';
import { relativeTime, humanizeDuration } from '../src/relative';

describe('relativeTime 相对时间', () => {
  it('未来方向', () => {
    expect(relativeTime('2026-08-14T10:00:00', '2026-08-14T09:00:00')).toBe('1小时后');
  });

  it('过去方向', () => {
    expect(relativeTime('2026-08-14T08:00:00', '2026-08-14T09:00:00')).toBe('1小时前');
  });

  it('几天前', () => {
    expect(relativeTime('2026-08-01', '2026-08-14')).toBe('13天前');
  });

  it('刚刚（几秒）', () => {
    expect(relativeTime(Date.now() + 1000)).toBe('几秒后');
  });

  it('小于 1 分钟按分钟显示（45s 阈值以上）', () => {
    expect(relativeTime('2026-08-14T09:00:30', '2026-08-14T09:00:00')).toBe('几秒后');
    expect(relativeTime('2026-08-14T09:00:50', '2026-08-14T09:00:00')).toBe('1分钟后');
  });
});

describe('humanizeDuration 人性化时长', () => {
  it('默认只显示最大单位', () => {
    expect(humanizeDuration(9_000_000)).toBe('2小时');
    expect(humanizeDuration(86_400_000)).toBe('1天');
  });

  it('largest=2 组合展示', () => {
    expect(humanizeDuration(9_000_000, { largest: 2 })).toBe('2小时30分钟');
    expect(humanizeDuration(90_000, { largest: 2 })).toBe('1分钟30秒');
  });

  it('不足 1 秒显示毫秒', () => {
    expect(humanizeDuration(500)).toBe('500毫秒');
  });

  it('毫秒级', () => {
    expect(humanizeDuration(1500, { largest: 2 })).toBe('1秒500毫秒');
  });
});
