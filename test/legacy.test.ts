import { describe, it, expect } from 'vitest';
import {
  getHour, transitionToSeconds, dateFormat, removeHMS, dateDiff,
  getFormat, getCurrentWeekDates, isLeapYear, validateTimeFormat,
} from '../src/legacy';
import { toDate } from '../src/parse';

describe('legacy 兼容层（v2 API + bug 回归）', () => {
  it('getHour 小时差', () => {
    expect(getHour('2019-12-30 14:00:00', '2020-01-01 14:00:00')).toBe(48);
    expect(getHour('2026-08-14 10:00:00', '2026-08-14 14:30:00')).toBe(4);
  });

  it('transitionToSeconds：修复丢秒 bug，支持 HH:mm:ss', () => {
    expect(transitionToSeconds('16:00')).toBe(57_600);
    expect(transitionToSeconds('16:00:00')).toBe(57_600);
    expect(transitionToSeconds('16:00:30')).toBe(57_630); // v2 会静默丢秒
    expect(Number.isNaN(transitionToSeconds('bad'))).toBe(true);
  });

  it('dateFormat 返回多格式对象', () => {
    const r = dateFormat(new Date(2026, 7, 14, 9, 5, 3));
    expect(r.ymdhms).toBe('2026-08-14 09:05:03');
    expect(r.ymd).toBe('2026-08-14');
    expect(r.hms).toBe('09:05:03');
    expect(r.ymdCN).toBe('2026年08月14日');
    expect(r.mdCN).toBe('08月14日');
  });

  it('dateFormat 无效输入返回原值', () => {
    const r = dateFormat('not-a-date');
    expect(r.ymdhms).toBe('not-a-date');
    expect(r.ymd).toBe('not-a-date');
  });

  it('removeHMS', () => {
    expect(removeHMS('2020-01-01 16:00:00')).toBe('2020-01-01');
    expect(removeHMS('bad')).toBe('');
  });

  it('dateDiff 相差天数（UTC 计算规避夏令时）', () => {
    expect(dateDiff('2019-12-13', '2019-12-15')).toEqual({ days: 2, daysCA: 3 });
    expect(dateDiff('2026-08-01', '2026-08-14')).toEqual({ days: 13, daysCA: 14 });
  });

  it('getFormat 完整信息', () => {
    const r = getFormat(new Date(2026, 7, 14, 9, 5, 3));
    expect(r.year).toBe(2026);
    expect(r.month).toBe(8);
    expect(r.day).toBe(14);
    expect(r.week).toBe(5);
    expect(r.weekCN).toBe('星期五');
    expect(r.time).toBe(new Date(2026, 7, 14, 9, 5, 3).getTime());
  });

  it('getFormat bug 回归：星期六、星期日均有正确中文', () => {
    expect(getFormat(new Date(2026, 7, 15)).weekCN).toBe('星期六'); // v2 缺失
    expect(getFormat(new Date(2026, 7, 16)).weekCN).toBe('星期日'); // v2 越界 undefined
  });

  it('getCurrentWeekDates 以周一为一周起点', () => {
    const r = getCurrentWeekDates();
    const start = toDate(r.start);
    const end = toDate(r.end);
    expect(start.getDay()).toBe(1);
    expect(end.getDay()).toBe(0);
    expect(start <= end).toBe(true);
  });

  it('isLeapYear / validateTimeFormat 保留', () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(validateTimeFormat('2026-08-14', 'YYYY-MM-DD')).toBe(true);
  });
});
