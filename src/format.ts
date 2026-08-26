import type { DateInput, DateParts } from './types';
import { toDate } from './parse';
import { getLocale, resolveLocale } from './i18n';
import type { Locale } from './locale-types';

/**
 * 从 Date 提取分字段结构（本地时区）
 */
export function toParts(date: Date): DateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds(),
    weekDay: date.getDay(),
    quarter: Math.floor(date.getMonth() / 3) + 1,
  };
}

const TOKEN_RE = /Y{1,4}|M{1,2}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|S{1,3}|A|a|Q|\[[^\]]*\]/g;

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

/** 根据分字段结构与模板生成字符串 */
export function formatFromParts(parts: DateParts, template: string, locale: Locale = getLocale()): string {
  const hour12 = parts.hours % 12 || 12;
  const values: Record<string, string> = {
    YYYY: String(parts.year),
    YY: pad(parts.year % 100),
    MM: pad(parts.month),
    M: String(parts.month),
    DD: pad(parts.day),
    D: String(parts.day),
    dddd: locale.weekdays[parts.weekDay] ?? '',
    ddd: locale.weekdaysShort[parts.weekDay] ?? '',
    d: String(parts.weekDay),
    HH: pad(parts.hours),
    H: String(parts.hours),
    hh: pad(hour12),
    h: String(hour12),
    mm: pad(parts.minutes),
    m: String(parts.minutes),
    ss: pad(parts.seconds),
    s: String(parts.seconds),
    SSS: pad(parts.milliseconds, 3),
    SS: pad(parts.milliseconds, 3).slice(0, 2),
    S: String(pad(parts.milliseconds, 3)[0]),
    A: locale.meridiem[parts.hours >= 12 ? 1 : 0] ?? '',
    a: (locale.meridiem[parts.hours >= 12 ? 1 : 0] ?? '').toLowerCase(),
    Q: String(parts.quarter),
  };

  return template.replace(TOKEN_RE, (token) => {
    if (token[0] === '[') return token.slice(1, -1);
    return values[token] ?? token;
  });
}

/**
 * 模板格式化，支持 token：
 * YYYY YY MM M DD D dddd ddd d HH H hh h mm m ss s S SS SSS A a Q
 * 非 token 字符原样输出；用 [ ] 包裹需要原样输出的字符，如 '[YYYY]' 输出 'YYYY'
 * @param input 日期输入
 * @param template 模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @param locale 语言，默认全局语言
 * @example format('2026-08-14', 'YYYY年MM月DD日 dddd') // '2026年08月14日 星期五'
 */
export function format(input: DateInput, template = 'YYYY-MM-DD HH:mm:ss', locale?: string | Locale): string {
  const date = toDate(input);
  if (Number.isNaN(date.getTime())) return 'Invalid Date';
  return formatFromParts(toParts(date), template, resolveLocale(locale));
}
