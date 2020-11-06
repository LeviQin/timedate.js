/**
*@Name: 提供各种日期和时间的计算转换，纯原生不依赖任何第三方
*@Author  QinBiao(qinbiao_web@163.com)
*@GitHub  https://github.com/muqin6610/timeDate/edit/master/timeDate.js
*@Version 2.0 版本更新，具体内容请查看文档
 */
export const timeDate = {
    getHour: function (s1, s2) {
        var date = new Date()
        var ymd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
        var reDate = /\d{4}-\d{1,2}-\d{1,2} /
        s1 = new Date((reDate.test(s1) ? s1 : ymd + s1).replace(/-/g, '/'))
        s2 = new Date((reDate.test(s2) ? s2 : ymd + s2).replace(/-/g, '/'))
        var ms = s2.getTime() - s1.getTime()
        return Math.floor(ms / 1000 / 60 / 60)
    },
    transitionToSeconds: function (s1) {
        var str = s1
        var arr = str.split(':')
        var hs = parseInt(arr[0] * 3600)
        var ms = parseInt(arr[1] * 60)
        var seconds = hs + ms
        return seconds
    },
    dateFormat: function (s1) {
        var date = new Date(s1)
        var year = date.getFullYear()
        // 日期格式中月份是从0开始因此要加上1
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return {
            ymdhms: year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds,
            ymdhm: year + "-" + month + "-" + day + " " + hours + ":" + minutes,
            ymd: year + "-" + month + "-" + day,
            md: month + "-" + day,
            hms: hours + ":" + minutes + ":" + seconds,
            hm: hours + ":" + minutes,
            ymdhmsCN: year + "年" + month + "月" + day + "日" + " " + hours + ":" + minutes + ":" + seconds,
            ymdCN: year + "年" + month + "月" + day + "日",
            mdCN: month + "月" + day + "日",
        }
    },
    removeHMS: function (s1) {
        var str = s1
        var newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(str)
        return newDate[0]
    },
    dateDiff: function (s1, s2) {
        var separator = '-' //日期分隔符
        var startDates = s1.split(separator)
        var endDates = s2.split(separator)
        var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2])
        var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2])
        var days = parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) // 不含今天,如:2019-12-13到2019-12-15,相差两天
        var daysCA = parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) + 1 // 包含今天,如:2019-12-13到2019-12-15,相差三天天
        return {
            days: days,
            daysCA: daysCA
        }
    },
    getFormat: function (s1) {
        var myDate = s1 ? new Date(s1) : new Date()
        var year = myDate.getFullYear()             //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1           //获取当前月份(0-12月)
        var day = myDate.getDate()                  //获取当前日(1-31)
        var week = myDate.getDay()                  //获取当前星期X(0-7)
        if (week == 0) week = 7
        var time = myDate.getTime()                 //获取时间戳(从1970.1.1开始的毫秒数)
        var hours = myDate.getHours()               //获取当前小时数(0-23)
        var minutes = myDate.getMinutes()           //获取当前分钟数(0-59)
        var seconds = myDate.getSeconds()           //获取当前秒数(0-59)
        var milliseconds = myDate.getMilliseconds() //获取当前毫秒数(0-999)
        function getWeek(W) {  // 获取中文星期数
            switch (W) {
                case 1:
                    return '星期一'
                    break;
                case 2:
                    return '星期二'
                    break;
                case 3:
                    return '星期三'
                    break;
                case 4:
                    return '星期四'
                    break;
                case 5:
                    return '星期五'
                    break;
                case 6:
                    return '星期六'
                    break;
                case 7:
                    return '星期日'
                    break;
                default:
                    break;
            }
        }
        return {
            year: year,
            yearCN: year + '年',
            month: month,
            monthCN: month + '月',
            day: day,
            dayCN: day + '日',
            week: week,
            weekCN: getWeek(week),
            time: time,
            hours: hours,
            hoursCN: hours + '小时',
            minutes: minutes,
            minutes
