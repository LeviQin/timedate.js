## timeDate.js
提供各种日期时间计算和转换的js插件

## 介绍
+ 计算两个时间之间的时间差
+ 时间转化为秒数
+ 日期格式化为yyyy-mm-dd hh:mm:ss || yyyy年mm月dd日
+ yyyy-mm-dd hh:mm:ss日期去除时分秒为yyyy-mm-dd
+ 计算两个日期相差天数
+ 获取当前日期的所有信息
+ 其他功能待更新...

## 使用
+ 引入到man.js
```js 
import timeDate from './util/timeDate.js'
// 注册到vue原型上
Vue.prototype.$timeDate = timeDate
```

+ 在任意组件调用
```js 
// 获取两个时间之间的时间差
let date1 = '2019-12-30 14:00:00'
let date2 = '2020-01-01 14:00:00 '
this.$timeDate.getHour(date1, date2) // 得到相差的小时数

// 获取一个时间的总秒数
let time = '16:00:00'
this.$timeDate.transitionToSeconds(time) // 得到总的秒数

// 日期格式化
let date = new Date()
this.$timeDate.dateFormat(date) // 得到一个对象,对象里包含yyyy-mm-dd hh:mm:ss & yyyy年mm月dd日 hh:mm:ss & yyyy-mm-dd hh:mm & yyyy-mm-dd & mm-dd & hh:mm:ss & h:m & yyyy年mm月dd日 & mm月dd日

// 日期去除时分秒
let date = '2020-01-01 16:00:00'
this.$timeDate.removeHMS(date) // 得到'2020-01-01'

// 返回两个日期相差的天数
let date1 = '2019-12-13'
let date2 = '2019-12-15'
this.$timeDate.dateDiff(date1, date2) // 得到一个对象,对象里包含两个属性: days(不含今天,如:2019-12-13到2019-12-15,相差两天)和daysCA(包含今天,如:2019-12-13到2019-12-15,相差三天天)

// 获取一个日期的所有信息
let date = new Date()
this.$timeDate.getFormat(date) // 得到一个对象,对象里包含:年,月,日,时,分,秒,星期,时间戳,当前毫秒数
```