/**
 *@Name: 提供各种日期和时间的计算转换，纯原生不依赖任何第三方
 *@Author  QinBiao(qinbiao_web@163.com)
 *@GitHub  https://github.com/muqin6610/timeDate/edit/master/timeDate.js
 *@Version 2.1 版本更新，具体内容请查看文档
 */
export default {
    /**
     * 计算两个时间之间的小时差
     * @param {string} time1 时间1，支持格式：'YYYY-MM-DD HH:mm:ss' 或 'HH:mm:ss'
     * @param {string} time2 时间2，支持格式：'YYYY-MM-DD HH:mm:ss' 或 'HH:mm:ss'
     * @returns {number} 相差的小时数
     */
    getHour: (time1, time2) => {
        // 获取当前日期
        let currentDate = new Date();
        let currentYmd = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate() + ' ';

        // 正则表达式匹配日期格式
        let reDate = /\d{4}-\d{1,2}-\d{1,2} /;

        // 将时间字符串转换为Date对象
        let date1 = new Date((reDate.test(time1) ? time1 : currentYmd + time1).replace(/-/g, '/'));
        let date2 = new Date((reDate.test(time2) ? time2 : currentYmd + time2).replace(/-/g, '/'));

        // 计算时间差，单位毫秒
        let timeDifference = date2.getTime() - date1.getTime();

        // 将时间差转换为小时并返回
        return Math.floor(timeDifference / (1000 * 60 * 60));
    },
    /**
     * 获取一个时间的总秒数
     * @param {string} timeString 时间字符串，格式为 'HH:mm'
     * @returns {number} 总秒数
     */
    transitionToSeconds: (timeString) => {
        // 将输入时间字符串拷贝到新变量中
        let str = timeString;

        // 将时间字符串按冒号分隔成小时和分钟数组
        let timeArray = str.split(':');

        // 将小时和分钟转换为总秒数
        let hoursInSeconds = parseInt(timeArray[0]) * 3600;
        let minutesInSeconds = parseInt(timeArray[1]) * 60;
        let totalSeconds = hoursInSeconds + minutesInSeconds;

        // 返回总秒数
        return totalSeconds;
    },

    /**
     * 日期格式化
     * @param {string|Date} inputDate 输入日期，可以是字符串或Date对象
     * @returns {object} 包含不同格式的日期字符串的对象
     */
    dateFormat: (inputDate) => {
        // 将输入日期转换为Date对象
        let date = new Date(inputDate);
        const isInvalidDate = isNaN(date.getTime());

        // 获取日期组件
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let seconds = date.getSeconds().toString().padStart(2, '0');

        // 根据格式返回不同格式的日期字符串
        return {
            ymdhms: isInvalidDate ? inputDate : `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            ymdhm: isInvalidDate ? inputDate : `${year}-${month}-${day} ${hours}:${minutes}`,
            ymd: isInvalidDate ? inputDate : `${year}-${month}-${day}`,
            md: isInvalidDate ? inputDate : `${month}-${day}`,
            hms: isInvalidDate ? inputDate : `${hours}:${minutes}:${seconds}`,
            hm: isInvalidDate ? inputDate : `${hours}:${minutes}`,
            ymdhmsCN: isInvalidDate ? inputDate : `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`,
            ymdCN: isInvalidDate ? inputDate : `${year}年${month}月${day}日`,
            mdCN: isInvalidDate ? inputDate : `${month}月${day}日`,
        };
    },
    /**
     * 日期去除时分秒
     * @param {string} dateString 带时分秒的日期字符串
     * @returns {string} 只包含年月日的日期字符串，格式为 'YYYY-MM-DD'
     */
    removeHMS: (dateString) => {
        // 将输入日期字符串拷贝到新变量中
        let str = dateString;

        // 使用正则表达式提取年月日部分
        let newDateArray = /\d{4}-\d{1,2}-\d{1,2}/g.exec(str);

        // 获取提取的年月日字符串
        let newDate = newDateArray ? newDateArray[0] : '';

        // 返回只包含年月日的日期字符串
        return newDate;
    },
    /**
     * 返回两个日期相差的天数
     * @param {string} date1 第一个日期字符串，格式为 'YYYY-MM-DD'
     * @param {string} date2 第二个日期字符串，格式为 'YYYY-MM-DD'
     * @returns {object} 包含相差天数的对象
     *   - days: 不含今天，例如：2019-12-13到2019-12-15，相差两天
     *   - daysCA: 包含今天，例如：2019-12-13到2019-12-15，相差三天
     */
    dateDiff: (date1, date2) => {
        // 日期分隔符
        let separator = '-';

        // 将日期字符串按分隔符分割成数组
        let startDateArray = date1.split(separator);
        let endDateArray = date2.split(separator);

        // 创建日期对象
        let startDate = new Date(startDateArray[0], startDateArray[1] - 1, startDateArray[2]);
        let endDate = new Date(endDateArray[0], endDateArray[1] - 1, endDateArray[2]);

        // 计算相差天数，不含今天
        let days = Math.abs(Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)));

        // 计算相差天数，包含今天
        let daysCA = days + 1;

        // 返回包含相差天数的对象
        return {
            days,
            daysCA
        };
    },

    /**
     * 获取一个日期的所有信息
     * @param {string|number|Date} date 日期，可以是字符串、数字（时间戳）或Date对象
     * @returns {object} 包含日期的各种信息的对象
     *   - year: 获取完整的年份 (4位, 1970-????)
     *   - yearCN: 获取完整的年份 (4位, 1970-????)，带中文年 (1970年-????)
     *   - month: 获取当前月份 (1-12)
     *   - monthCN: 获取当前月份 (1-12月)，带中文月 (1-12月)
     *   - day: 获取当前日 (1-31)
     *   - dayCN: 获取当前日 (1-31)，带中文日 (1-31日)
     *   - week: 获取当前星期几 (0-6)
     *   - weekCN: 获取当前星期几 (星期一到星期日)
     *   - time: 获取时间戳 (从1970.1.1开始的毫秒数)
     *   - hours: 获取当前小时数 (0-23)
     *   - hoursCN: 获取当前小时数 (0-23小时)，带中文小时 (0-23小时)
     *   - minutes: 获取当前分钟数 (0-59)
     *   - minutesCN: 获取当前分钟数 (0-59分钟)，带中文分钟 (0-59分钟)
     *   - seconds: 获取当前秒数 (0-59)
     *   - secondsCN: 获取当前秒数 (0-59秒)，带中文秒 (0-59秒)
     *   - milliseconds: 获取当前毫秒数 (0-999)
     *   - millisecondsCN: 获取当前毫秒数 (0-999)，带中文毫秒 (0-999毫秒)
     */
    getFormat: (date) => {
        const cnWeekList = ["default", "星期一", "星期二", "星期三", "星期四", "星期五", "星期日"];

        // 将输入日期转换为Date对象
        let myDate = date instanceof Date ? date : new Date(date);

        // 提取日期的各个组成部分
        let year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        let week = myDate.getDay();
        if (week === 0) week = 7; // 将周日的数字调整为7
        let time = myDate.getTime();
        let hours = myDate.getHours();
        let minutes = myDate.getMinutes();
        let seconds = myDate.getSeconds();
        let milliseconds = myDate.getMilliseconds();

        // 返回包含日期的各种信息的对象
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
            secondsCN: seconds + '秒',
            milliseconds,
            millisecondsCN: milliseconds + '毫秒'
        };
    },
    /**
     * 判断是否为闰年
     * @param {number} year 年份
     * @returns {boolean} 是否为闰年
     */
    isLeapYear(year) {
        // 闰年的判定规则：
        // 1. 能被4整除但不能被100整除，或者
        // 2. 能被400整除
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    },
    /**
     * 获取当前周的起始和结束日期
     * @returns {object} 包含起始和结束日期的对象
     */
    getCurrentWeekDates() {
        const today = new Date();
        const currentDayOfWeek = today.getDay(); // 获取当前星期几（0-6，其中0代表星期日）

        // 计算当前日期距离周一的偏移天数
        const daysToMonday = (currentDayOfWeek + 6) % 7;

        // 计算周一的日期
        const monday = new Date(today);
        monday.setDate(today.getDate() - daysToMonday);

        // 计算周日的日期
        const sunday = new Date(today);
        sunday.setDate(today.getDate() + (6 - currentDayOfWeek));

        // 格式化日期为 'YYYY-MM-DD'
        const formatDateString = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            start: formatDateString(monday),
            end: formatDateString(sunday),
        };
    },
    /**
     * 校验时间字符串是否符合指定的格式。
     * @param {string} timeStr - 待校验的时间字符串。
     * @param {string} formatStr - 指定的时间格式，默认为"YYYY-MM-DD HH:mm:ss"。
     * @returns {boolean} - 如果时间字符串符合指定格式，返回 true；否则返回 false。
     */
    validateTimeFormat(timeStr, formatStr = "YYYY-MM-DD HH:mm:ss") {
        // 构建正则表达式，用于匹配指定格式的时间字符串
        const regexStr = formatStr
            .replace("YYYY", "\\d{4}")
            .replace("MM", "(0[1-9]|1[0-2])")
            .replace("DD", "(0[1-9]|[1-2][0-9]|3[0-1])")
            .replace("HH", "([0-1][0-9]|2[0-3])")
            .replace("mm", "[0-5][0-9]")
            .replace("ss", "[0-5][0-9]");

        const regex = new RegExp(`^${regexStr}$`);

        // 使用正则表达式检查时间字符串格式
        return regex.test(timeStr);
    }
}