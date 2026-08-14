# timedate.js

零依赖的现代日期时间工具库。TypeScript 编写，支持 ESM / CJS 双格式，tree-shaking 友好，保留 v2 全部 API。

- 解析：ISO 8601 / `YYYY-MM-DD HH:mm:ss` / 中文格式 / 相对量（`2d`、`-3h`）
- 格式化：模板 token（`YYYY年MM月DD日 dddd`）+ 中文/英文语言包
- 计算：不可变 `add` / `subtract` / `startOf` / `endOf` / 精确 `diff`
- 日历：月历网格、ISO 周数、季度、每月天数、闰年
- 人性化：相对时间（`3天前`）、时长（`2小时30分钟`）
- 时区：基于 `Intl.DateTimeFormat` 的 `formatInTimeZone`
- 兼容：v2 的 9 个 API 全部保留（历史 bug 已修复）

## 安装

```shell
npm install timedate.js
```

## 快速开始

```js
// 命名导入（推荐，支持 tree-shaking）
import { format, addDays, diff, relativeTime } from 'timedate.js'

// v2 用法仍然可用
import timedate from 'timedate.js'

format('2026-08-14', 'YYYY年MM月DD日 dddd') // '2026年08月14日 星期五'
addDays('2026-08-14', 7)                    // Date
diff('2026-08-14', '2026-08-01', 'day')     // 13
relativeTime('2026-08-01')                  // '14天前'
```

CommonJS：

```js
const { format } = require('timedate.js')
```

## API

### 解析

| API | 说明 |
| --- | --- |
| `parse(input)` / `toDate(input)` | 解析任意输入为 Date，`Date` 输入会复制（不可变） |
| `isValid(input)` | 是否为合法日期 |

支持的输入：`Date`、毫秒时间戳、`'2026-08-14'`、`'2026-08-14 09:05:03'`、`'2026/08/14'`、`'2026年8月14日'`、`'09:05:03'`（补当天）、`'2d'` / `'-3h'` 相对量、RFC 2822（走原生解析）。

### 格式化

```js
format(input, template, locale?) // 默认模板 'YYYY-MM-DD HH:mm:ss'
```

Token 一览：

| Token | 输出 | Token | 输出 |
| --- | --- | --- | --- |
| `YYYY` `YY` | 2026 / 26 | `HH` `H` | 09 / 9（24 小时制） |
| `MM` `M` | 08 / 8 | `hh` `h` | 09 / 9（12 小时制） |
| `DD` `D` | 14 / 14 | `mm` `m` | 05 / 5 |
| `dddd` `ddd` | 星期五 / 周五 | `ss` `s` | 03 / 3 |
| `d` | 5（0-6，0=周日） | `S` `SS` `SSS` | 毫秒 |
| `A` `a` | 下午 / pm | `Q` | 季度 1-4 |

非 token 字符原样输出；用 `[ ]` 转义，如 `'[YYYY]年'` 输出 `'YYYY年'`。

### 计算（全部不可变，返回新 Date）

```js
add(input, amount, unit)        addDays / addMonths / addYears / ...
subtract(input, amount, unit)   subtractDays / subtractMonths / ...
startOf(input, 'day' | 'week' | 'month' | 'quarter' | 'year' | ...)
endOf(input, unit)              // week 以周一为一周起点
diff(a, b, unit?, round?)       // unit: ms~year；round: floor/ceil/trunc/round
```

月末自动裁剪：`addMonths('2026-01-31', 1)` → `2026-02-28`。
`diff` 的 day/week 使用 UTC 日历差（规避夏令时），month/quarter/year 使用真实日历差。

### 比较

```js
isBefore(a, b) / isAfter(a, b) / isSame(a, b, unit?) / isSameOrBefore / isSameOrAfter
isBetween(date, start, end, inclusive?) // inclusive: boolean 或 { start, end }，默认包含两端
clamp(date, min, max)
```

### 日历

```js
isLeapYear(2024)              // true
daysInMonth(2026, 2)          // 28
getQuarter('2026-08-14')      // 3
getDayOfYear('2026-02-01')    // 32
getISOWeek('2026-08-14')      // 33（ISO 8601 周四法则）
getMonthGrid(2026, 8, 1)      // 6×7 月历网格（Date[][], 首尾含占位，weekStart 默认周一）
```

### 人性化

```js
relativeTime('2026-08-01')                        // '14天前'（Intl.RelativeTimeFormat 同款阈值）
humanizeDuration(9_000_000)                       // '2小时'（largest 默认 1）
humanizeDuration(9_000_000, { largest: 2 })       // '2小时30分钟'
```

### 时区

```js
formatInTimeZone('2026-08-14T12:00:00Z', 'Asia/Shanghai')            // '2026-08-14 20:00:00'
formatInTimeZone('2026-08-14T12:00:00Z', 'America/New_York', 'YYYY/MM/DD HH:mm') // '2026/08/14 08:00'
```

### i18n

```js
setLocale('en') / getLocale()   // 内置 zh / en；可传入自定义 Locale 对象
```

### v2 兼容 API（历史 bug 已修复）

| API | 说明 |
| --- | --- |
| `getHour(t1, t2)` | 小时差（向下取整） |
| `transitionToSeconds('16:00:30')` | 总秒数（修复丢秒，支持 `HH:mm` / `HH:mm:ss`） |
| `dateFormat(date)` | 返回 9 种格式的对象 |
| `removeHMS(str)` | 去时分秒 → `'YYYY-MM-DD'` |
| `dateDiff(d1, d2)` | `{ days, daysCA }`（UTC 计算，规避夏令时） |
| `getFormat(date)` | 完整信息对象（修复星期六缺失、周日越界） |
| `getCurrentWeekDates()` | 当前周周一 / 周日 |
| `isLeapYear(year)` / `validateTimeFormat(str, fmt?)` | 同 v2，校验增强 |

## 开发

```shell
npm run typecheck   # tsc --noEmit
npm test            # vitest（71 用例）
npm run build       # tsup：ESM + CJS + d.ts
```

## 目录结构

```
src/
  index.ts       入口（命名导出 + 兼容默认导出）
  parse.ts       解析层
  format.ts      模板格式化
  arithmetic.ts  计算层（add/diff/startOf/...）
  calendar.ts    日历工具
  relative.ts    相对时间 / 人性化时长
  timezone.ts    时区格式化
  validate.ts    格式校验
  i18n.ts        语言包（zh/en）
  legacy.ts      v2 兼容层
test/            Vitest 测试
```

## License

MIT
