import type { DateInput, DateParts, LocaleName } from './types';
import { toDate } from './parse';
import { toParts, formatFromParts } from './format';
import { getLocale } from './i18n';
import type { Locale } from './locale-types';

/**
 * 在指定时区下格式化日期（基于 Intl.DateTimeFormat，零依赖）
 * @param input 日期输入
 * @param timeZone IANA 时区名，如 'Asia/Shanghai'、'America/New_York'
 * @param template 模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @param locale 语言，默认全局语言
 * @example formatInTimeZone('2026-08-14T12:00:00Z', 'America/New_York', 'YYYY-MM-DD HH:mm') // '2026-08-14 08:00'
 */
export function formatInTimeZone(
  input: DateInput,
  timeZone: string,
  template = 'YYYY-MM-DD HH:mm:ss',
  locale?: LocaleName | Locale,
): string {
  const date = toDate(input);
  const loc: Locale = typeof locale === 'string' ? getLocale() : (locale ?? getLocale());
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
    });
    const parts = dtf.formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((p) => p.type === type)?.value ?? 0);
    const local = new Date(
      get('year'), get('month') - 1, get('day'),
      get('hour'), get('minute'), get('second'),
      date.getMilliseconds(),
    );
    const proxyParts: DateParts = toParts(local);
    return formatFromParts(proxyParts, template, loc);
  } catch {
    // 时区名非法时回退本地时区
    return formatFromParts(toParts(date), template, loc);
  }
}
