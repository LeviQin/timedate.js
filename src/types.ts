/**
 * 类型定义
 */

/** 可接受的日期输入类型 */
export type DateInput = Date | string | number | null | undefined;

/** 解析时使用的当前时间来源与空值策略 */
export interface ParseOptions {
  /** 为相对量、纯时间和空值解析提供可控的当前时间 */
  now?: Date | (() => Date);
  /** 默认保持 v3 行为：空值解析为当前时间 */
  empty?: 'now' | 'invalid';
}

/** 差值单位 */
export type DiffUnit =
  | 'ms'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

/** 截断单位（startOf / endOf） */
export type StartOfUnit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

/** diff 取整方式 */
export type RoundType = 'floor' | 'ceil' | 'trunc' | 'round';

/** 增量单位 */
export type AddUnit =
  | 'ms'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

/** 支持的语言 */
export type LocaleName = 'zh' | 'en';

/** 格式化结果的分字段结构（供模板格式化与时区格式化复用） */
export interface DateParts {
  year: number;
  /** 1-12 */
  month: number;
  /** 1-31 */
  day: number;
  /** 0-23 */
  hours: number;
  /** 0-59 */
  minutes: number;
  /** 0-59 */
  seconds: number;
  /** 0-999 */
  milliseconds: number;
  /** 0-6，0 = 周日 */
  weekDay: number;
  /** 1-4 */
  quarter: number;
}
