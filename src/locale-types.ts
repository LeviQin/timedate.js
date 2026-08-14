/** 语言包结构定义（独立文件避免循环引用） */
export interface RelativeTemplate {
  s: string;
  m: string;
  mm: string;
  h: string;
  hh: string;
  d: string;
  dd: string;
  M: string;
  MM: string;
  y: string;
  yy: string;
}

export interface Locale {
  name: string;
  /** index 0-6，0 = 周日 */
  weekdays: readonly string[];
  weekdaysShort: readonly string[];
  meridiem: readonly [string, string];
  relativeTime: {
    future: (s: string) => string;
    past: (s: string) => string;
    templates: RelativeTemplate;
  };
  humanize: {
    year: (n: number) => string;
    month: (n: number) => string;
    day: (n: number) => string;
    hour: (n: number) => string;
    minute: (n: number) => string;
    second: (n: number) => string;
    ms: (n: number) => string;
  };
}
