const axios = require('axios')
// ownfm5s2rAMeN3i6quBGry87eGS8
const sendUser = ["ownfm5i6RMGzy3U0CnK8XD79CLOM", "ownfm5s2rAMeN3i6quBGry87eGS8"];
var getRandomColor = function(){    
    return  '#' + (function(color){    
         return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
         && (color.length == 6) ?  color : arguments.callee(color);    
    })('');    
 } 

class YiQingService {
    constructor(token) {
        this.url = 'https://raw.githubusercontent.com/NemophilistWatermelon/NodeYqAction/master/result.json'
        this.token = token
        this.tvSongUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${this.token}`
        const provice = '河南省'
        const city = '焦作市'
        const county = '武陟县'
        const ApiToken = 'USEOUa5B5CztWw8z'
        this.apiYq = `https://v2.alapi.cn/api/springTravel/risk?provice=${provice}&city=${city}&county=${county}&token=${ApiToken}`
        this.headers = {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
          };
    }

    startPromise(func) {
        const that = this
        const fetch1 = new Promise((resolve) => {
            that.startApiYqApi(resolve)
        })
        const fetch2 = new Promise((resolve) => {
            that.startFetchInfo(resolve)
        })
        Promise.all([fetch1, fetch2]).then(response => {
            func(response, this)
        })
    }

    startApiYqApi(resolve) {
        axios({
            url: this.apiYq,
            headers: this.headers
        }).then(data => {
            resolve(data.data)
        }).catch(error => {
            resolve('获取数据失败')
        })
    }

    startFetchInfo(resolve) {
        axios({
            url: this.url,
            headers: this.headers,
        }).then(data => {
            resolve(data.data)
        }).catch(error => {
            resolve('获取数据失败')
        })
    }

    get_yq_area(orginData, loopOption, deepItem) {
        let s = '无'
        if (Array.isArray(orginData[loopOption]) && orginData[loopOption].length) {
            for (let i = 0; i < orginData[loopOption].length; i++) {
                const element = orginData[loopOption][i];
                if (element[deepItem]) {
                    for (let j = 0; j < element[deepItem].length; j++) {
                       s += ', ' + j
                        
                    }
                }
            }
        }
        return s
    }

    templateData(data, to_user) {
        const high_city_list = this.get_yq_area(data['YIQING'], 'high_list', 'communitys')
        const mid_city_list = this.get_yq_area(data['YIQING'], 'middle_list', 'communitys')
        console.log({
            url: data['GITHENAN']['result']['url']
        })
        let d = {
            "touser": to_user,
            "template_id": 'UPO5JAYRx6Bl6V18yv2AKU7Eq0O-Sd6i2ePY-uWrF-A',
            "url": data['GITHENAN']['url'],
            "topcolor": "#FF0000",
            "data": {
                "city": {
                    "value": data['YIQING']['city'],
                    "color": getRandomColor()
                },
                "country": {
                    "value": data['YIQING']['county'],
                    "color": getRandomColor()
                },
                "end_update_time": {
                    "value": data['YIQING']['end_update_time'],
                    "color": getRandomColor()
                },
                "high_count": {
                    "value": data['YIQING']['high_count'],
                    "color": getRandomColor()
                },
                "middle_count": {
                    "value": data['YIQING']['middle_count'],
                    "color": getRandomColor()
                },
                'high_city_list': {
                    "value": high_city_list,
                    "color": getRandomColor()
                },
                'mid_city_list': {
                    "value": mid_city_list,
                    "color": getRandomColor()
                },
                'henanResult': {
                    "value": data['GITHENAN']['result'],
                    "color": getRandomColor()
                },
                'henanOrgin': {
                    "value": data['GITHENAN']['dataOrgin'],
                    "color": getRandomColor()
                },
                'henanDate': {
                    "value": data['GITHENAN']['fetchTime'],
                    "color": getRandomColor()
                }
            }
        }
        return d
    }

    Tui_Wechat_Info(data) {
        axios({
            url: this.tvSongUrl,
            method: 'post',
            headers: this.headers,
            data: this.templateData(data)
        })
        .then(response => {
            console.log('疫情推送：', response)
        })
    }

    tui_chat(tempalte) {
        // console.log(this.tvSongUrl, tempalte)
        axios({
            headers: this.headers,
            url: this.tvSongUrl,
            method: 'POST',
            data: tempalte,
        }).then(data => {
            // console.log('推送响应：', data)
            console.log('msg: => 推送成功： user: ', tempalte.touser)
        }).catch(error => {
            console.log('推送失败:' + error)
        })
    }

    init() {}
}


const init = token => {
    new YiQingService(token).startPromise((response, yiQingService) => {
        const [res1, res2] = response
        let result = {
            YIQING: '',
            GITHENAN: ''
        }
        if (res1 !== '获取数据失败') {
            result.YIQING = res1.data
        }
    
        if (res2 !== '获取数据失败') {
            result.GITHENAN = res2
        } 
        console.log('result', result)
        sendUser.forEach(user => {
            const t = yiQingService.templateData(result, user)
            yiQingService.tui_chat(t)
        })
    })
}


module.exports.init = token => {
    new YiQingService(token).startPromise((response, yiQingService) => {
        const [res1, res2] = response
        let result = {
            YIQING: '',
            GITHENAN: ''
        }
        if (res1 !== '获取数据失败') {
            result.YIQING = res1.data
        }
    
        if (res2 !== '获取数据失败') {
            result.GITHENAN = res2
        } 
        console.log('result', result)
        sendUser.forEach(user => {
            const t = yiQingService.templateData(result, user)
            yiQingService.tui_chat(t)
        })
    })
}