# Changelog

## [3.2.0] - 2026-08-27

### 修复

- 对 ISO、短日期、中文日期和时间格式执行严格的日期与时间范围校验。
- 修复 `format`、`relativeTime`、`humanizeDuration`、`formatInTimeZone` 的函数级 locale 名称参数。
- 修复 `S`、`SS`、`SSS` 毫秒 token 的输出语义。
- 使用 UTC 日历差计算年内天数和 ISO 周数，降低 DST 环境下的边界错误。
- `validateTimeFormat` 支持完整格式 token、转义文本和真实年月日校验。

### 新增

- `ParseOptions`：支持注入 `now`，以及 `empty: 'invalid'` 空值策略。
- `fromUnixSeconds` / `toUnixSeconds`。
- `defineLocale`、按名称 `getLocale`、`resolveLocale`。
- `isValidTimeZone`。
- `durationToParts` 和结构化 duration 类型。
- 英文 duration 的数值与单位、单位之间支持 locale 分隔符。
- Node 18/20/22 CI、DST 测试和 npm 打包检查。

### 兼容性

- 保留 v2 legacy API 和默认导出。
- `null`、`undefined`、空字符串默认仍解析为当前时间；需要严格行为时使用 `{ empty: 'invalid' }`。
