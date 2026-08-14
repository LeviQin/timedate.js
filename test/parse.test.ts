import { describe, it, expect } from 'vitest';
import { toDate, isValid } from '../src/parse';

describe('toDate 解析', () => {
  it('Date 输入会复制，不引用原对象', () => {
    const src = new Date(2026, 7, 14, 9, 0, 0);
    const out = toDate(src);
    out.setFullYear(2000);
    expect(src.getFullYear()).toBe(2026);
  });

  it('null / undefined / 空串返回当前时间', () => {
    expect(isValid(toDate(null))).toBe(true);
    expect(isValid(toDate(undefined))).toBe(true);
  });

  it('数字按毫秒时间戳解析', () => {
    expect(toDate(0).getTime()).toBe(0);
  });

  it("'YYYY-MM-DD' 按本地零点解析（不触发 UTC 偏移）", () => {
    const d = toDate('2026-08-14');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(7);
    expect(d.getDate()).toBe(14);
    expect(d.getHours()).toBe(0);
  });

  it("'YYYY-MM-DD HH:mm:ss' 完整解析", () => {
    const d = toDate('2026-08-14 09:05:03');
    expect(d.getHours()).toBe(9);
    expect(d.getSeconds()).toBe(3);
  });

  it("'YYYY/MM/DD' 与中文格式解析", () => {
    expect(toDate('2026/08/14').getDate()).toBe(14);
    const cn = toDate('2026年8月14日');
    expect(cn.getMonth()).toBe(7);
    expect(cn.getDate()).toBe(14);
  });

  it("'HH:mm:ss' 补当天日期", () => {
    const now = new Date();
    const d = toDate('14:30:00');
    expect(d.getFullYear()).toBe(now.getFullYear());
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
  });

  it('相对量解析：2d / -3h / +1w', () => {
    const base = Date.now();
    const d2 = toDate('2d');
    expect(Math.round((d2.getTime() - base) / 86_400_000)).toBe(2);
    const m3 = toDate('-3h');
    expect(Math.round((m3.getTime() - base) / 3_600_000)).toBe(-3);
  });

  it('非法输入返回 Invalid Date', () => {
    expect(isValid('not-a-date')).toBe(false);
    expect(isValid(new Date('xx'))).toBe(false);
    expect(isValid({} as never)).toBe(false);
  });
});
