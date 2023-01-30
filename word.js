const axios = require('axios');

var getRandomColor = function(){    
    return  '#' + (function(color){    
         return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
         && (color.length == 6) ?  color : arguments.callee(color);    
    })('');    
 } 

function main() {
    console.log('运行1111')
    const tokenUrl =
      "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx631d482c48976d13&secret=e1fc9f7c7aa8f00cd443052181ffa641";
    const timeStamp = new Date().getTime();
    const eight_hours = 1000 * 60 * 60 * 8
    const resultTimeStamp = timeStamp + eight_hours

    const date = new Date(resultTimeStamp)

    console.log('时间：', date.toLocaleString())
    const hour = date.getHours();
    const minute = date.getMinutes()
    const time = `${hour}:${minute}`
    console.log(hour, '时间', '分钟:', minute);
    const waterList = {
      '8:30': {
        time: "8:30",
        content: "现在喝水有助于补充身体的水分~",
      },
      '11:0': {
        time: "11:00",
        content: "现在喝水有助于解乏放松~",
      },
      '12:50': {
        time: "12:50",
        content: "现在喝水可达到减负减肥(听我的，这杯水可以跳过😄)~",
      },
      '15:0': {
        time: "15:00",
        content: "快喝水吧，提神醒脑， 多多划水~~~",
      },
      '17:30': {
        time: "17:30",
        content: "现在喝水有助于消化吸收哦~~~",
      },
      '22:0': {
        time: "22:00",
        content:
          "现在喝水可以达到解毒,排泄,消化增进血液循环的作用 \n \n 今天【二喜广播】播报到此结束， 晚安!",
      },
    };
    async function tvSongAction(url, data) {
        console.log('推送运行')
      const headers = {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
      };
      const result = await axios({
        url,
        method: "POST",
        data,
        headers,
      });
    }
    const template = function (token) {
      // ownfm5s2rAMeN3i6quBGry87eGS8
      const to_user = ["ownfm5i6RMGzy3U0CnK8XD79CLOM", "ownfm5s2rAMeN3i6quBGry87eGS8"];
      const tuiSongUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`;
      // const template_id = "cHZ_N_v_znLziyW-UMjmoTRFXkxIpf_u9mcXSZm7HO8";
      const template_id = '4dHb0z73Cddw0yImidkgg3cCT2UshFTH6p5hZlfgz2g'
      let text = ''
      let self = '  无论何时都要元气满满~'
      if (hour >= 6) {
          text = '早上好，'
      }

    if (hour >= 12) {
        text = '中午好，'
    }

    if (hour >= 13) {
        text = '下午好，'
    }

    if (hour >= 18) {
        text = '晚上好，'
    }

    text += self

      for (let index = 0; index < to_user.length; index++) {
          if (true) {
            let t = waterList[time]
            let data = {
                touser: to_user[index],
                template_id: template_id,
                topcolor: "#FF0000",
                data: {
                  text: {
                    value: '不胖！',
                    color: getRandomColor(),
                  },
                  date: {
                    value: '泡面要盘的！',
                    color: getRandomColor(),
                  },
                  textContent: {
                    value: '所以盘吧~',
                    color: getRandomColor()
                  },
                },
              };
              tvSongAction(tuiSongUrl, data);
          }
        
      }
    };
    
  
    function getToken(func) {
       
      const headers = {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
      };
      axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx631d482c48976d13&secret=e1fc9f7c7aa8f00cd443052181ffa641', {
        headers
      }).then((data) => {
      const d = data.data;
      const access_token = d.access_token;
      func(access_token);
    });
    //   axios.get({
    //     url:
    //       "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx631d482c48976d13&secret=e1fc9f7c7aa8f00cd443052181ffa641",
    //     headers,
    //   }).then((data) => {
    //       console.log('axios', data)
    //     const d = data.data;
    //     const access_token = d.access_token;
    //     func(access_token);
    //   });
    }
    
    if ( true) {
      console.log('符合时间')
      getToken(template);
    } else {
      console.log('不符合', time)
    }
    // if (time === '9:0') {
    //   console.log('符合预期')
    //   getToken(token => {
    //     require('./YiQing').init(token)
    //   })
    // } else {
    //   console.log('不符合', time)
    // }
  }
  module.exports.main = main