import type { DateInput } from './types';

const DATE_ONLY = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const DATE_TIME = /^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d{1,3}))?)?$/;
const SLASH_DATE = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(?: (\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
const CN_DATE = /^(\d{4})年(\d{1,2})月(\d{1,2})日(?:[ 时](\d{1,2}))?(?:[点:：](\d{1,2}))?(?:分?([\d]{1,2})秒?)?/;
const TIME_ONLY = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d{1,3}))?)?$/;
const RELATIVE = /^([+-]?\d+)(ms|s|m|h|d|w|M|y)$/;
const NUMERIC = /^\d{10,}$/;

/**
 * 将任意合法输入统一解析为 Date 对象。
 * - Date 对象会被复制，后续修改不影响原对象
 * - 数字按毫秒时间戳处理
 * - 字符串支持：ISO 8601、'YYYY-MM-DD HH:mm:ss'、'YYYY/MM/DD'、'YYYY年MM月DD日'、
 *   'HH:mm:ss'（补当天）、'2d' / '-3h' 等相对量、RFC 2822（走原生解析）
 * 解析失败返回 Invalid Date，可用 isValid() 判断
 */
export function toDate(input: DateInput): Date {
  if (input === null || input === undefined || input === '') {
    return new Date();
  }
  if (input instanceof Date) {
    return new Date(input.getTime());
  }
  if (typeof input === 'number') {
    return new Date(input);
  }
  if (typeof input !== 'string') {
    return new Date(NaN);
  }

  const s = input.trim();

  let m: RegExpExecArray | null;
  if ((m = DATE_ONLY.exec(s))) {
    return new Date(+m[1]!, +m[2]! - 1, +m[3]!);
  }
  if ((m = DATE_TIME.exec(s))) {
    return new Date(
      +m[1]!, +m[2]! - 1, +m[3]!, +m[4]!, +m[5]!,
      m[6] ? +m[6]! : 0, m[7] ? +m[7]!.padEnd(3, '0') : 0,
    );
  }
  if ((m = SLASH_DATE.exec(s))) {
    return new Date(
      +m[1]!, +m[2]! - 1, +m[3]!,
      m[4] ? +m[4]! : 0, m[5] ? +m[5]! : 0, m[6] ? +m[6]! : 0,
    );
  }
  if ((m = CN_DATE.exec(s))) {
    return new Date(
      +m[1]!, +m[2]! - 1, +m[3]!,
      m[4] ? +m[4]! : 0, m[5] ? +m[5]! : 0, m[6] ? +m[6]! : 0,
    );
  }
  if ((m = TIME_ONLY.exec(s))) {
    const now = new Date();
    return new Date(
      now.getFullYear(), now.getMonth(), now.getDate(),
      +m[1]!, +m[2]!, m[3] ? +m[3]! : 0, m[4] ? +m[4]!.padEnd(3, '0') : 0,
    );
  }
  if ((m = RELATIVE.exec(s))) {
    return applyRelative(m[1]!, m[2]!);
  }
  if (NUMERIC.test(s)) {
    return new Date(Number(s));
  }
  return new Date(s);
}

/** 相对量：'2d' / '-3h' / '+1w' / '6M' / '1y'（相对当前时间） */
function applyRelative(amountStr: string, unit: string): Date {
  const amount = Number(amountStr);
  const d = new Date();
  switch (unit) {
    case 'ms': d.setMilliseconds(d.getMilliseconds() + amount); break;
    case 's': d.setSeconds(d.getSeconds() + amount); break;
    case 'm': d.setMinutes(d.getMinutes() + amount); break;
    case 'h': d.setHours(d.getHours() + amount); break;
    case 'd': d.setDate(d.getDate() + amount); break;
    case 'w': d.setDate(d.getDate() + amount * 7); break;
    case 'M': {
      const day = d.getDate();
      d.setDate(1);
      d.setMonth(d.getMonth() + amount);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      d.setDate(Math.min(day, last));
      break;
    }
    case 'y': {
      const day = d.getDate();
      d.setDate(1);
      d.setFullYear(d.getFullYear() + amount);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      d.setDate(Math.min(day, last));
      break;
    }
  }
  return d;
}

/** 判断输入是否为合法日期 */
export function isValid(input: DateInput): boolean {
  return !Number.isNaN(toDate(input).getTime());
}

/** parse 的别名，语义更直观 */
export const parse = toDate;
