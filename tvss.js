const axios = require('axios')
const { cityInfo } = require('./city')
var getRandomColor = function(){    
    return  '#' + (function(color){    
         return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
         && (color.length == 6) ?  color : arguments.callee(color);    
    })('');
 } 
class TvSs {
    constructor() {
        this.appid = 'wx631d482c48976d13'
        this.secret = 'e1fc9f7c7aa8f00cd443052181ffa641'

        // 每日一句话的 api 地址
        this.ciBaUrl = 'http://open.iciba.com/dsapi/'
        // this.oneDay = 1000 * 60 * 60 * 24
        this.oneDay = 0
        this.togetherDay = '2018-04-06'
        this.currentYear = new Date().getFullYear()
        // '1998-12-23 00:00:00'
        this.loverBirthday = `${this.currentYear}-12-23 00:00:00`
        // ownfm5s2rAMeN3i6quBGry87eGS8
        this.tvUser = ['ownfm5i6RMGzy3U0CnK8XD79CLOM', 'ownfm5s2rAMeN3i6quBGry87eGS8']
        this.templateId = 'viEH6e0Win7NmO1E9Lb5AQUl22bep2cqXBPBQjjgBRk'
        this.headers = {
            'Content-Type': 'application/json',
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`
        }
        this.addressAreaId = cityInfo.河南.焦作.AREAID
        this.init()
        // this.getXz()
    }

    init() {
        let birthMap = this.getBirthDay()
        let togetherDay = this.getLoveDate()
        this.fetchPromiseAll(birthMap, togetherDay)
    }

    async fetchUrl(url, headers = '', data) {
        return await axios({
            url,
            headers: headers || this.headers,
            params: data,
        })
    }

    async fetchUrlPost(url, headers = '', data) {
        return await axios({
            method: 'POST',
            url,
            headers: headers || this.headers,
            data,
        })
    }

    // 获取天气信息
    async getTianqi() {
        let nowDate = new Date().getTime() + this.oneDay
        let headers = {
            "Referer": `http://www.weather.com.cn/weather1d/${this.addressAreaId}.shtml`,
            'UserAgent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`
        }
        this.tianqiUrl = `http://d1.weather.com.cn/dingzhi/${this.addressAreaId}.html?_=${nowDate}`
        return await this.fetchUrl(this.tianqiUrl, headers)
    }

    getDate() {
        let pinZero = function(n) {
            return n < 10 ? '0' + n : n
        }
        let c = new Date().getTime() + this.oneDay
        let d = new Date(c)

        let y = d.getFullYear()
        let m = pinZero(d.getMonth() + 1)
        let day = pinZero(d.getDate())
        console.log(`${y}-${m}-${day}`, 'ddddddddd')
        return `${y}-${m}-${day}`

    }
    // 获取星座信息
    async getXz() {
        let date = this.getDate()
        // console.log(date, '时间是')
        let xzUrl = `https://api.jisuapi.com/astro/fortune?astroid=10&date=${date}&appkey=e4d2fb2352aa863d`
        return await this.fetchUrl(xzUrl)
        // return {}
    }

    // 获取每日一句话
    async getEveryDayWords() {
        return await this.fetchUrl(this.ciBaUrl)
    }
    async fetchPromiseAll(birthMap, togetherDay) {
        let promise1 = new Promise(resolve => {
            resolve(this.getEveryDayWords())
        })

        let promise2 = new Promise(resolve => {
            resolve(this.getTianqi())
        })

        let promise3 = new Promise(resolve => {
            resolve(this.getXz())
        })

        let promise4 = new Promise(resolve => {
            resolve(this.getWechatToken())
        })

        Promise.all([promise1, promise2, promise3, promise4]).then(data => {
            let everyDayWords = data[0]
            let weather = data[1].data.split('=')[1].split(';')[0]
            let xz = data[2].data.result
            let tokenGet = data[3].data.access_token

            let wInfo = {}
            var note = ''
            var xzInfo = {}

            // 每日一句话
            if (everyDayWords.data) {
                note = everyDayWords.data.note
            }
            // 天气
            if (weather) {
                wInfo = JSON.parse(weather).weatherinfo
            }

            // 星座信息
            if (xz) {
                xzInfo = xz
            }

            // 启动主函数推送逻辑
            this.startMain({
                birthMap,
                togetherDay,
                xzInfo,
                wInfo,
                note,
                token: tokenGet,
            })

        })
    }
    getWeek() {
        let c = new Date().getTime() + this.oneDay
        let d = new Date(c)
        let week_list = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
        let current = d.getDay()
        return week_list[current]
    }

    /**
     * 
     * @param {*} user 发送给的用户
     * @param {*} o 准备好的所有接口信息
     */
    createTemplate(user, o) {
         const get_color = getRandomColor
         let date = this.getDate()
         let week = this.getWeek()
         let happyWords = `今天运势很棒👍🏻，注定要赚的盆满钵满兜满，新的一年就是要开开心心，平平安安！兔兔兔`
         let happyto = '新年快乐！🧨'
         let data = {
            "touser": user,
            "template_id": this.templateId,
            "url": "https://self-udpn.netlify.app/self/#/index",
            "topcolor": "#FF0000",
            "data": {
                "xz": {
                    "value": o.xzInfo['astroname']
                },
                "xtc": {
                    "value": o.xzInfo['today']['career'],
                    "color": get_color()
                },
                "xtm": {
                    "value": o.xzInfo['today']['money'],
                    "color": get_color()
                },
                "xtt": {
                    "value": o.xzInfo['today']['date'],
                    "color": get_color()
                },
                "xtl": {
                    "value": o.xzInfo['today']['love'],
                    "color": get_color()
                },
                "xth": {
                    "value": o.xzInfo['today']['health'],
                    "color": get_color()
                },
                "xtcc": {
                    "value": o.xzInfo['today']['color'],
                    "color": get_color()
                },
                "xtsn": {
                    "value": o.xzInfo['today']['number'],
                    "color": get_color()
                },
                "xtd": {
                    "value": o.xzInfo['today']['presummary'],
                    // "value": happyWords,
                    "color": get_color()
                },
                "xts": {
                    "value": o.xzInfo['today']['star'],
                    "color": get_color()
                },
                "xzTodayLuckyStarSummary": {
                    "value": o.xzInfo['today']['summary'],
                    "color": get_color()
                },
                "xtmd": {
                    "value": o.xzInfo['month']['date'],
                    "color": get_color()
                },
                "xtmc": {
                    "value": o.xzInfo['month']['career'],
                    "color": get_color()
                },
                "xtmh": {
                    "value": o.xzInfo['month']['health'],
                    "color": get_color()
                },
                "xtml": {
                    "value": o.xzInfo['month']['love'],
                    "color": get_color()
                },
                "xtmm": {
                    "value": o.xzInfo['month']['money'],
                    "color": get_color()
                },
                "xtmdd": {
                    "value": o.xzInfo['month']['summary'],
                    "color": get_color()
                },
                "date": {
                    "value": `${date}  ${week}`,
                    "color": get_color()
                },
                "city": {
                    "value": o.wInfo.cityname,
                    "color": get_color()
                },
                "weather": {
                    "value": o.wInfo.weather,
                    "color": get_color()
                },
                "min_t": {
                    "value": o.wInfo.tempn,
                    "color": get_color()
                },
                "max_t": {
                    "value": o.wInfo.temp,
                    "color": get_color()
                },
                "love_day": {
                    "value": o.togetherDay,
                    "color": get_color()
                },
                "note_ch": {
                    "value": o.note,
                    // "value": happyto,
                    "color": get_color()
                }
            }
        }

        data.data.birthday1 = {
            value: o.birthMap.words,
            color: get_color()
        }

        this.sendMessage(data, o.token)
    }

    async sendMessage(data, token) {
        let url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`
        let tvssResult = await this.fetchUrlPost(url, this.headers, data)
        console.log({
            tvssResult: tvssResult.data.errmsg
        })
    }

    startMain(o) {
        for (let i = 0; i < this.tvUser.length; i++) {
            const user = this.tvUser[i];
            this.createTemplate(user, o)
        }
    }

    async getWechatToken() {
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appid}&secret=${this.secret}`
        return await this.fetchUrl(url)
    }

    // 距离生日差计算
    getBirthDay() {
        var nowDate = new Date().getTime() + this.oneDay
        var targetDate = new Date(this.loverBirthday).getTime()
        var lastDay = Math.round((targetDate - nowDate) / 1000 / 60 / 60 / 24)
        var n = new Date().getFullYear();
        if (lastDay < 0) {
            n += 1;
            let d = `${n}-12-23 00:00:00`;
            targetDate = new Date(d).getTime();
            lastDay = Math.round((targetDate - nowDate) / 1000 / 60 / 60 / 24);
          }
        
        
        let words = {
            isTarget: false,
            lastDay: lastDay,
            words: `距离宝宝生日还有${lastDay}天`
        }

        if (lastDay === 0) {
            words.words = '今天是二喜的生日，生日快乐！要天天开心😄'
        }
        return words
    }

    // 相遇天数计算
    getLoveDate() {
        let nowDate = new Date().getTime() + this.oneDay
        let targetDate = new Date(this.togetherDay).getTime()
        let fix = new Date(targetDate).toLocaleString()
        let lastDay = Math.round((nowDate - targetDate) / 1000 / 60 / 60 / 24)
        return lastDay
    }
}


module.exports.main = function() {
    // 服务器时间慢八小时
    // const eight_hours = 1000 * 60 * 60 * 8
    const eight_hours = 0
    const timeStamp = new Date().getTime();
    const resultTimeStamp = timeStamp + eight_hours

    const date = new Date(resultTimeStamp)

    console.log('时间：', date.toLocaleString())
    const hour = date.getHours();
    const minute = date.getMinutes()
    const time = `${hour}:${minute}`
    // 当时间到 每天早上七点开始推送
    if (time === '7:0') {
        new TvSs()
    } else {
        console.log('推送时间未到' + time)
    }
}