import type { Locale } from './locale-types';

const locales = new Map<string, Locale>();

/** 注册一个可供函数级 locale 参数和 setLocale 使用的语言包。 */
export function defineLocale(locale: Locale): void {
  locales.set(locale.name, locale);
}

defineLocale({
  name: 'zh',
  weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  weekdaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  meridiem: ['上午', '下午'],
  relativeTime: {
    future: (s) => `${s}后`,
    past: (s) => `${s}前`,
    templates: {
      s: '几秒',
      m: '1分钟',
      mm: '%d分钟',
      h: '1小时',
      hh: '%d小时',
      d: '1天',
      dd: '%d天',
      M: '1个月',
      MM: '%d个月',
      y: '1年',
      yy: '%d年',
    },
  },
  humanize: {
    separator: '',
    unitSeparator: '',
    year: () => '年',
    month: () => '个月',
    day: () => '天',
    hour: () => '小时',
    minute: () => '分钟',
    second: () => '秒',
    ms: () => '毫秒',
  },
});

defineLocale({
  name: 'en',
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  meridiem: ['AM', 'PM'],
  relativeTime: {
    future: (s) => `in ${s}`,
    past: (s) => `${s} ago`,
    templates: {
      s: 'a few seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years',
    },
  },
  humanize: {
    separator: ' ',
    unitSeparator: ' ',
    year: (n) => (n === 1 ? 'year' : 'years'),
    month: (n) => (n === 1 ? 'month' : 'months'),
    day: (n) => (n === 1 ? 'day' : 'days'),
    hour: (n) => (n === 1 ? 'hour' : 'hours'),
    minute: (n) => (n === 1 ? 'minute' : 'minutes'),
    second: (n) => (n === 1 ? 'second' : 'seconds'),
    ms: (n) => (n === 1 ? 'millisecond' : 'milliseconds'),
  },
});

let currentLocale: Locale = locales.get('zh') ?? locales.get('en')!;

/** 切换全局语言，返回是否成功；传入 Locale 会先注册再切换。 */
export function setLocale(locale: string | Locale): boolean {
  if (typeof locale !== 'string') {
    defineLocale(locale);
    currentLocale = locale;
    return true;
  }
  const next = locales.get(locale);
  if (!next) return false;
  currentLocale = next;
  return true;
}

/** 获取当前语言，传入名称时获取已注册的指定语言。 */
export function getLocale(): Locale;
export function getLocale(name: string): Locale | undefined;
export function getLocale(name?: string): Locale | undefined {
  return name === undefined ? currentLocale : locales.get(name);
}

/** 解析函数级语言参数；未知名称回退到当前全局语言。 */
export function resolveLocale(locale?: string | Locale): Locale {
  if (!locale) return currentLocale;
  if (typeof locale !== 'string') return locale;
  return locales.get(locale) ?? currentLocale;
}
