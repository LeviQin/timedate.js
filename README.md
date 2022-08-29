## timedate.js
提供各种日期时间计算和转换的js插件

## 功能介绍
+ 计算两个时间之间的时间差
+ 时间转化为秒数
+ 日期格式化为yyyy-mm-dd hh:mm:ss || yyyy年mm月dd日
+ yyyy-mm-dd hh:mm:ss日期去除时分秒为yyyy-mm-dd
+ 计算两个日期相差天数
+ 获取当前日期的所有信息
+ 其他功能待更新...

## 使用

#### 导入
```js 
import timedate from 'timedate'
```



### 具体API调用
+ 计算两个时间之间的时间差, getHour
```js 
let date1 = '2019-12-30 14:00:00' // *值不能为纯日期, 比如：2019-12-30
let date2 = '2020-01-01 14:00:00 ' // *值不能为纯日期, 比如：2020-01-01
timedate.getHour(date1, date2) // 得到相差的小时数
```

+ 获取一个时间的总秒数, transitionToSeconds
```js
let time = '16:00:00' // *值不能为纯日期, 比如：2019-12-30
timedate.transitionToSeconds(time) // 得到总的秒数
```

+ 日期格式化, dateFormat
```js
let date = new Date() // 值不能为纯时间，比如：10：45：30
timedate.dateFormat(date) // 得到一个对象,对象里包含yyyy-mm-dd hh:mm:ss & yyyy年mm月dd日 hh:mm:ss & yyyy-mm-dd hh:mm & yyyy-mm-dd & mm-dd & hh:mm:ss & h:m & yyyy年mm月dd日 & mm月dd日
```

+ 日期去除时分秒, removeHMS
```js
let date = '2020-01-01 16:00:00'
timedate.removeHMS(date) // 得到'2020-01-01'
```

+ 返回两个日期相差的天数, dateDiff
```js
let date1 = '2019-12-13' // 值不能为纯时间，比如：10：45：30
let date2 = '2019-12-15' // 值不能为纯时间，比如：10：45：30
timedate.dateDiff(date1, date2) // 得到一个对象,对象里包含两个属性: days(不含今天,如:2019-12-13到2019-12-15,相差两天)和daysCA(包含今天,如:2019-12-13到2019-12-15,相差三天天)
```

+ 获取一个日期的所有信息, getFormat
```js
let date = new Date()
timedate.getFormat(date) // 得到一个对象,对象里包含:年,月,日,时,分,秒,星期,时间戳,当前毫秒数
```
