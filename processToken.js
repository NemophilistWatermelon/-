const fs = require('fs')
const axios = require('axios')
class ProcessToken {
    constructor() {
        this.tokenpath = './tokenCatch.json'
        this.appid = 'wx631d482c48976d13'
        this.secret = 'e1fc9f7c7aa8f00cd443052181ffa641'
        this.headers = {
            'Content-Type': 'application/json',
            'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`
        }
        this.tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appid}&secret=${this.secret}`
        // 由于微信返回的是 7200 秒 js 里面都是毫秒计算 因此要乘以10000
        this.secondes = 1000
        this.readToken()
    }

    // 检查过期时间 过期时间 小于 1s 发送请求token
    doCheck() {}

    writeToken(data) {
        fs.writeFileSync(this.tokenpath,  JSON.stringify(data, null, 2), 'utf-8')
        return this.readToken()
    }

    async requestAccessToken() {
        console.log('run')
        try {
            let res = await this.fetchUrl(this.tokenUrl)
            let nowDate = new Date().getTime()
            let d = {
                token: res.data.access_token,
                time: nowDate + res.data.expires_in
            }
            this.writeToken(d)
        } catch(erro) {
            console.log(erro)
            console.log('失败了')
        } 
    }

    async fetchUrl(url, headers = '', data = '') {
        return await axios({
            url,
            headers: headers || this.headers,
            params: data,
        })
    }

    async readToken() {
        const res = fs.readFileSync(this.tokenpath)
        let nowDate = new Date().getTime()
        console.log(res)
        if (res.toString()) {
            let txt = res.toString()
            let r = JSON.parse(txt)
            // 小于了 0.xx 小时 直接去重新请求 api 获取token
            let isExpires = ((r.time - nowDate) / 1000 / 60 / 60) < 0
            console.log('2323', isExpires)
            if (!isExpires) {
                console.log('没有过期！！')
                return r.token
            }
        }
        return this.requestAccessToken()
    }
}

new ProcessToken()
