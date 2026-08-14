/**
 * 时间格式校验：把格式化模板转成正则，验证字符串是否匹配。
 * 相比 v2 的逐个 replace，这里用 split/join 全量替换，
 * 模板中重复出现同一 token 也不会出错。
 */

const TOKEN_MAP: ReadonlyArray<readonly [string, string]> = [
  ['YYYY', '\\d{4}'],
  ['YY', '\\d{2}'],
  ['MM', '(0[1-9]|1[0-2])'],
  ['M', '([1-9]|1[0-2])'],
  ['DD', '(0[1-9]|[12]\\d|3[01])'],
  ['D', '([1-9]|[12]\\d|3[01])'],
  ['HH', '([01]\\d|2[0-3])'],
  ['H', '(\\d|1\\d|2[0-3])'],
  ['hh', '(0[1-9]|1[0-2])'],
  ['mm', '[0-5]\\d'],
  ['ss', '[0-5]\\d'],
  ['SSS', '\\d{3}'],
];

/**
 * 校验时间字符串是否符合指定的格式模板
 * @param timeStr 待校验的时间字符串
 * @param formatStr 时间格式模板，默认 'YYYY-MM-DD HH:mm:ss'
 */
export function validateTimeFormat(timeStr: string, formatStr = 'YYYY-MM-DD HH:mm:ss'): boolean {
  let regexStr = formatStr;
  for (const [token, pattern] of TOKEN_MAP) {
    regexStr = regexStr.split(token).join(pattern);
  }
  return new RegExp(`^${regexStr}$`).test(timeStr);
}
