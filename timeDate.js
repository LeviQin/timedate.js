/**
*@Name: 日期时间各种计算转换
*@Author  biaoqin(1019613129@qq.com)
*@GitHub  https://github.com/muqin6610/timeDate/edit/master/timeDate.js
*@Version 1.0
*@计算两个时间之间的时间差: getHour(s1, s2)
*@时间转化为秒数: transitionToSeconds(T)
*@日期格式化为yyyy-mm-dd hh:mm:ss || yyyy年mm月dd日 hh:mm:ss : dateFormat(D)
*@yyyy-mm-dd hh:mm:ss日期去除时分秒为yyyy-mm-dd : removeHMS(D)
*@计算两个日期相差天数: dateDiff(S,E)
*@获取当前日期的所有信息: getFormat(D)
 */
 export const timeDate = {
    /**
    *返回两个时间之间的时间差
    *@param s1: yyyy-mm-dd hh:mm:ss
    *@param s2: yyyy-mm-dd hh:mm:ss
    *@return number: hours
     */
    getHour(s1, s2) {
       let date = new Date()
       let ymd = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
       let reDate = /\d{4}-\d{1,2}-\d{1,2} /
       s1 = new Date((reDate.test(s1) ? s1 : ymd + s1).replace(/-/g, '/'))
       s2 = new Date((reDate.test(s2) ? s2 : ymd + s2).replace(/-/g, '/'))
       let ms = s2.getTime() - s1.getTime()
       return Math.floor(ms / 1000 / 60 / 60)
    },

    /**
    *返回一个时间的总秒数
    *@param T: hh:mm:ss
    *@return number: seconds
     */
    transitionToSeconds(T) {
      let str = T
      let arr = str.split(':')
      let hs = parseInt(arr[0] * 3600)
      let ms = parseInt(arr[1] * 60)
      let seconds = hs + ms
      return seconds
    },

    /**
    *返回yyyy-mm-dd hh:mm:ss日期格式
    *@param D: new Date()
    *@return json: ymdhms: yyy-mm-dd hh:mm:ss, yyyy-mm-dd h:m, yyyy-mm-dd, mm-dd, hh:mm:ss, hh:mm,
    *yyyy年mm月dd日 hh:mm:ss, ymd: yyyy年mm月dd日, mm月dd日
     */
    dateFormat(D) {
      let date = new Date(D)
      let year = date.getFullYear()
      // 日期格式中月份是从0开始因此要加上1
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return {
        ymdhms: year + "- "+ month + "-" + day + " " + hours + ":" + minutes + ":" + seconds,
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

    /**
    *返回除去时分秒日期格式yyyy-mm-dd
    *@param D: yyyy-mm-dd hh:mm:ss
    *@return string: yyyy-mm-dd
     */
    removeHMS(D) {
      let str = D
      let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(str)
      return newDate[0]
    },

    /**
    *返回两个日期相差得天数
    *@param S: yyyy-mm-dd
    *@param E: yyyy-mm-dd
    *@return number: days(不含今天,如:2019-12-13到2019-12-15,相差两天), daysCA(包含今天,如:2019-12-13到2019-12-15,相差三天天)
     */
    dateDiff(S,E) {
      let separator = '-' //日期分隔符
      let startDates = S.split(separator)
      let endDates = E.split(separator)
      let startDate = new Date(startDates[0], startDates[1]-1, startDates[2])
      let endDate = new Date(endDates[0], endDates[1]-1, endDates[2])
      let days = parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) // 不含今天,如:2019-12-13到2019-12-15,相差两天
      let daysCA = parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) + 1 // 包含今天,如:2019-12-13到2019-12-15,相差三天天
      return {
        days: days,
        daysCA: daysCA
      }
    },

    /**
    *返回一个日期的所有信息
    *@param D: new Date
    *@return json: year: 年(4位,1970-????), month: 月(1-12月), day: 日(1-31), week: 星期(0-6,0代表星期天), time: 获取时间戳(从1970.1.1开始的毫秒数),  
    *hours: 小时数(0-23), minutes: 分钟数(0-59), seconds: 秒数(0-59), milliseconds: 当前毫秒数(0-999)
     */
    getFormat(D) {
        let myDate
        if(D) {
          myDate = new Date(D)
        }else {
          myDate = new Date()
        }
        let year = myDate.getFullYear()             //获取完整的年份(4位,1970-????)
        let month = myDate.getMonth() + 1           //获取当前月份(0-12月)
        let day = myDate.getDate()                  //获取当前日(1-31)
        let week = myDate.getDay()                  //获取当前星期X(0-7)
        if(week == 0) week = 7
        let time = myDate.getTime()                 //获取时间戳(从1970.1.1开始的毫秒数)
        let hours = myDate.getHours()               //获取当前小时数(0-23)
        let minutes = myDate.getMinutes()           //获取当前分钟数(0-59)
        let seconds = myDate.getSeconds()           //获取当前秒数(0-59)
        let milliseconds = myDate.getMilliseconds() //获取当前毫秒数(0-999)
        return {
          year: year,
          yearCN: year + '年',
          month: month,
          monthCN: month + '月',
          day: day,
          dayCN: day + '日',
          week: week,
          weekCN: this.getWeek(week),
          time: time,
          hours: hours,
          hoursCN: hours + '小时',
          minutes: minutes,
          minutesCN: minutes + '分钟',
          seconds: seconds,
          secondsCN: seconds + '秒',
          milliseconds: milliseconds
        }
    },

    /**
    *返回中文星期几
    *@param W: number
    *@return weekCN: 星期几
     */
    getWeek(W) {
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
 }
