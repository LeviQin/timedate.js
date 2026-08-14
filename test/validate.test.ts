import { describe, it, expect } from 'vitest';
import { validateTimeFormat } from '../src/validate';

describe('validateTimeFormat 格式校验', () => {
  it('默认格式 YYYY-MM-DD HH:mm:ss', () => {
    expect(validateTimeFormat('2026-08-14 09:05:03')).toBe(true);
    expect(validateTimeFormat('2026-8-14 09:05:03')).toBe(false); // 月必须补零
    expect(validateTimeFormat('2026-08-14 25:05:03')).toBe(false); // 小时越界
  });

  it('日期格式', () => {
    expect(validateTimeFormat('2026-08-14', 'YYYY-MM-DD')).toBe(true);
    expect(validateTimeFormat('2026-13-14', 'YYYY-MM-DD')).toBe(false);
    expect(validateTimeFormat('2026-08-32', 'YYYY-MM-DD')).toBe(false);
  });

  it('重复 token 的模板也能正确校验（v2 的 replace 只替换第一个）', () => {
    expect(validateTimeFormat('2026-2026', 'YYYY-YYYY')).toBe(true);
    expect(validateTimeFormat('2026-08-14 09:05', 'YYYY-MM-DD HH:mm')).toBe(true);
    expect(validateTimeFormat('2026-08-14 09:05:03', 'YYYY-MM-DD HH:mm')).toBe(false);
  });
});
