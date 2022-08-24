/**
*@Name: 提供各种日期和时间的计算转换，纯原生不依赖任何第三方
*@Author  QinBiao(qinbiao_web@163.com)
*@GitHub  https://github.com/muqin6610/timeDate/edit/master/timeDate.js
*@Version 2.1 版本更新，具体内容请查看文档
 */
export default {
    /**
     * 计算两个时间之间的时间差
     * @param {*} s1 时间1
     * @param {*} s2 时间2
     * @returns 相差的小时数
     */
    getHour: (s1, s2) => {
        let date = new Date()
        let ymd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
        let reDate = /\d{4}-\d{1,2}-\d{1,2} /
        s1 = new Date((reDate.test(s1) ? s1 : ymd + s1).replace(/-/g, '/'))
        s2 = new Date((reDate.test(s2) ? s2 : ymd + s2).replace(/-/g, '/'))
        let ms = s2.getTime() - s1.getTime()
        return Math.floor(ms / 1000 / 60 / 60)
    },
    /**
     * 获取一个时间的总秒数
     * @param {*} s1 时间
     * @returns seconds: 总秒数
     */
    transitionToSeconds: (s1) => {
        let str = s1
        let arr = str.split(':')
        let hs = parseInt(arr[0] * 3600)
        let ms = parseInt(arr[1] * 60)
        let seconds = hs + ms
        return seconds
    },
    /**
     * 日期格式化
     * @param {*} s1 日期
     * @returns ymdhms: 2022-08-24 11:48:55
     * @returns ymdhm: 2022-08-24 11:48
     * @returns ymd: 2022-08-24
     * @returns md: 08-24
     * @returns hms: 11:48:55
     * @returns hm: 11:48
     * @returns ymdhmsCN: 2022年08月24日 11:48:55
     * @returns ymdCN: 2022年08月24日
     * @returns mdCN: 08月24日
     */
    dateFormat: (s1) => {
        let date = new Date(s1)
        let year = date.getFullYear()
        // 日期格式中月份是从0开始因此要加上1
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return {
            ymdhms: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            ymdhm: `${year}-${month}-${day} ${hours}:${minutes}`,
            ymd: `${year}-${month}-${day}`,
            md: `${month}-${day}`,
            hms: `${hours}:${minutes}:${seconds}`,
            hm: `${hours}:${minutes}`,
            ymdhmsCN: `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`,
            ymdCN: `${year}年${month}月${day}日`,
            mdCN: `${month}月${day}日`,
        }
    },
    /**
     * 日期去除时分秒
     * @param {*} s1 日期
     * @returns YYYY-MM-DD
     */
    removeHMS: (s1) => {
        let str = s1
        let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(str)
        return newDate[0]
    },
    /**
     * 返回两个日期相差的天数
     * @param {*} s1 日期1
     * @param {*} s2 日期2
     * @returns days:  不含今天,如:2019-12-13到2019-12-15,相差两天
     * @returns daysCA:  包含今天,如:2019-12-13到2019-12-15,相差三天天
     */
    dateDiff: (s1, s2) => {
        let separator = '-' //日期分隔符
        let startDates = s1.split(separator)
        let endDates = s2.split(separator)
        let startDate = new Date(startDates[0], startDates[1] - 1, startDates[2])
        let endDate = new Date(endDates[0], endDates[1] - 1, endDates[2])
        let days = parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24)
        let daysCA = parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) + 1
        return {
            days,
            daysCA
        }
    },
    /**
     * 获取一个日期的所有信息
     * @param {*} s1 日期
     * @returns year: 获取完整的年份(4位,1970-????)
     * @returns yearCN: 获取完整的年份(4位,1970-????)，带中文年(1970年-????)
     * @returns month: 获取当前月份(0-12)
     * @returns monthCN: 获取当前月份(0-12月)，带中文月(0-12月)
     * @returns day: 获取当前日(1-31)
     * @returns dayCN: 获取当前日(1-31)，带中文日(1-31日)
     * @returns week: 获取当前星期X(0-7)
     * @returns weekCN: 获取当前星期X(星期一到星期日)
     * @returns time: 获取时间戳(从1970.1.1开始的毫秒数)
     * @returns hours: 获取当前小时数(0-23)
     * @returns hoursCN: 获取当前小时数(0-23)，带中文小时(0-23小时)
     * @returns minutes: 获取当前分钟数(0-59)
     * @returns minutesCN: 获取当前分钟数(0-59)，带中文分钟(0-59分钟)
     * @returns seconds: 获取当前秒数(0-59)
     * @returns secondsCN: 获取当前秒数(0-59)，带中文秒(0-59秒)
     * @returns milliseconds: 获取当前毫秒数(0-999)
     * @returns millisecondsCN: 获取当前毫秒数(0-999))，带中毫秒(0-999毫秒)
     */
    getFormat: (s1) => {
        const cnWeekList = ["default", "星期一", "星期二", "星期三", "星期四", "星期五", "星期日"];
        let myDate = s1 ? new Date(s1) : new Date()
        let year = myDate.getFullYear()
        let month = myDate.getMonth() + 1
        let day = myDate.getDate()
        let week = myDate.getDay()
        if (week == 0) week = 7
        let time = myDate.getTime()
        let hours = myDate.getHours()
        let minutes = myDate.getMinutes()
        let seconds = myDate.getSeconds()
        let milliseconds = myDate.getMilliseconds()
        return {
            year,
            yearCN: year + '年',
            month,
            monthCN: month + '月',
            day,
            dayCN: day + '日',
            week,
            weekCN: cnWeekList[week],
            time,
            hours,
            hoursCN: hours + '小时',
            minutes,
            minutesCN: minutes + '分钟',
            seconds,
            secondsCN: seconds + "秒",
            milliseconds,
            millisecondsCN: milliseconds + '毫秒'
        }
    }
}