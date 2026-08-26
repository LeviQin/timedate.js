import type { DateInput } from './types';
import { toDate } from './parse';
import { resolveLocale } from './i18n';
import type { Locale } from './locale-types';

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

const THRESHOLDS: ReadonlyArray<readonly [string, number]> = [
  ['s', 45 * SEC],
  ['m', 90 * SEC],
  ['mm', 45 * MIN],
  ['h', 90 * MIN],
  ['hh', 22 * HOUR],
  ['d', 36 * HOUR],
  ['dd', 25.5 * DAY],
  ['M', 11 * MONTH],
  ['MM', 45 * MONTH],
  ['y', 21 * 365 * DAY],
  ['yy', Infinity],
];

const KEY_TO_NUM: Record<string, number> = {
  s: 0, m: 1, mm: 2, h: 1, hh: 2, d: 1, dd: 2, M: 1, MM: 2, y: 1, yy: 2,
};

export interface RelativeTimeOptions {
  /** 为相对量输入和省略的 base 提供可控的当前时间 */
  now?: Date | (() => Date);
}

function fillTemplate(template: string, num: number): string {
  return template.replace('%d', String(num));
}

/**
 * 相对时间：'3天前' / '2小时后'
 * @param input 目标时间
 * @param base 基准时间，默认当前时间
 * @param locale 语言，默认全局语言
 */
export function relativeTime(
  input: DateInput,
  base?: DateInput,
  locale?: string | Locale,
  options: RelativeTimeOptions = {},
): string {
  const loc: Locale = resolveLocale(locale);
  const parseOptions = { now: options.now };
  const inputDate = toDate(input, parseOptions);
  const baseDate = toDate(base, parseOptions);
  if (Number.isNaN(inputDate.getTime()) || Number.isNaN(baseDate.getTime())) return 'Invalid Date';
  const diff = inputDate.getTime() - baseDate.getTime();
  const abs = Math.abs(diff);
  const future = diff > 0;

  let key = 's';
  for (const [k, t] of THRESHOLDS) {
    if (abs < t) { key = k; break; }
  }

  const templates = loc.relativeTime.templates;
  const raw = templates[key as keyof typeof templates] ?? templates.s;
  const num = KEY_TO_NUM[key] ?? 0;
  const text = num > 0
    ? fillTemplate(raw, Math.max(1, Math.round(abs / unitMs(key))))
    : raw;
  return future ? loc.relativeTime.future(text) : loc.relativeTime.past(text);
}

function unitMs(key: string): number {
  if (key.startsWith('y')) return 365 * DAY;
  if (key.startsWith('M')) return MONTH;
  if (key.startsWith('d')) return DAY;
  if (key.startsWith('h')) return HOUR;
  return MIN;
}

export interface HumanizeOptions {
  /** 最多展示的单位个数，默认 1（只显示最大单位） */
  largest?: number;
  locale?: string | Locale;
}

export type DurationUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'ms';

export interface DurationPart {
  unit: DurationUnit;
  value: number;
}

const HUMANIZE_UNITS: ReadonlyArray<readonly [DurationUnit, number]> = [
  ['year', 365 * DAY],
  ['month', MONTH],
  ['day', DAY],
  ['hour', HOUR],
  ['minute', MIN],
  ['second', SEC],
  ['ms', 1],
];

/**
 * 人性化时长：humanizeDuration(9_000_000) → '2小时30分钟'
 * 月按 30 天、年按 365 天近似。
 * @param ms 毫秒数
 */
export function humanizeDuration(ms: number, options: HumanizeOptions = {}): string {
  const { largest = 1, locale } = options;
  const loc: Locale = resolveLocale(locale);
  if (!Number.isFinite(ms)) return 'Invalid Duration';
  const parts = durationToParts(ms, largest);
  if (parts.length === 0) return `0${loc.humanize.unitSeparator ?? ''}${loc.humanize.second(1)}`;
  return parts
    .map(({ unit, value }) => `${value}${loc.humanize.unitSeparator ?? ''}${loc.humanize[unit](value)}`)
    .join(loc.humanize.separator ?? '');
}

/** 将时长拆成结构化单位，默认返回所有有值的单位。 */
export function durationToParts(ms: number, largest = Number.POSITIVE_INFINITY): DurationPart[] {
  if (!Number.isFinite(ms) || largest <= 0) return [];
  let rest = Math.abs(ms);
  const parts: DurationPart[] = [];
  for (const [unit, size] of HUMANIZE_UNITS) {
    if (parts.length >= largest) break;
    const value = Math.floor(rest / size);
    if (value > 0) {
      parts.push({ unit, value });
      rest -= value * size;
    }
  }
  if (parts.length === 0) return [{ unit: 'second', value: 0 }];
  return parts;
}
