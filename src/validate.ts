import { daysInMonth } from './calendar';

const TOKEN_PATTERNS: Record<string, string> = {
  YYYY: '\\d{4}',
  YY: '\\d{2}',
  MM: '(?:0[1-9]|1[0-2])',
  M: '(?:[1-9]|1[0-2])',
  DD: '(?:0[1-9]|[12]\\d|3[01])',
  D: '(?:[1-9]|[12]\\d|3[01])',
  dddd: '[^\\d]+',
  ddd: '[^\\d]+',
  d: '[0-6]',
  HH: '(?:[01]\\d|2[0-3])',
  H: '(?:\\d|1\\d|2[0-3])',
  hh: '(?:0[1-9]|1[0-2])',
  h: '(?:[1-9]|1[0-2])',
  mm: '[0-5]\\d',
  m: '(?:[0-9]|[1-5]\\d)',
  ss: '[0-5]\\d',
  s: '(?:[0-9]|[1-5]\\d)',
  SSS: '\\d{3}',
  SS: '\\d{2}',
  S: '\\d',
  A: '[^\\d]+',
  a: '[^\\d]+',
  Q: '[1-4]',
};

const TOKENS = Object.keys(TOKEN_PATTERNS).sort((a, b) => b.length - a.length);

/**
 * 校验时间字符串是否符合指定的格式模板。
 * 支持 format() 的 token 与 [转义]，并会检查年月日是否真实存在。
 */
export function validateTimeFormat(timeStr: string, formatStr = 'YYYY-MM-DD HH:mm:ss'): boolean {
  let regexStr = '^';
  const captures: string[] = [];

  for (let index = 0; index < formatStr.length;) {
    if (formatStr[index] === '[') {
      const end = formatStr.indexOf(']', index + 1);
      if (end >= 0) {
        regexStr += escapeRegex(formatStr.slice(index + 1, end));
        index = end + 1;
        continue;
      }
    }

    const token = TOKENS.find((candidate) => formatStr.startsWith(candidate, index));
    if (token) {
      regexStr += `(${TOKEN_PATTERNS[token]})`;
      captures.push(token);
      index += token.length;
    } else {
      regexStr += escapeRegex(formatStr[index]!);
      index += 1;
    }
  }

  const match = new RegExp(`${regexStr}$`).exec(timeStr);
  if (!match) return false;

  const values = new Map<string, number>();
  captures.forEach((token, index) => {
    if (!values.has(token)) values.set(token, Number(match[index + 1]));
  });

  const month = values.get('MM') ?? values.get('M');
  const day = values.get('DD') ?? values.get('D');
  if (month !== undefined && day !== undefined) {
    const year = values.has('YYYY') ? values.get('YYYY')! : 2000 + (values.get('YY') ?? 0);
    if (day > daysInMonth(year, month)) return false;
  }

  return true;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
