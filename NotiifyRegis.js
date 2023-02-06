// 推送程序注册

const axios = require("axios");

class utilMethods {
  constructor() {}

  getRandomColor() {
    return (
      "#" +
      (function (color) {
        return (color += "0123456789abcdef"[Math.floor(Math.random() * 16)]) &&
          color.length == 6
          ? color
          : arguments.callee(color);
      })("")
    );
  }

  getDate() {
    const timeStamp = new Date().getTime();
    const date = new Date(timeStamp);

    console.log("时间：", date.toLocaleString());
    const hour = date.getHours();
    const minute = date.getMinutes();
    const time = `${hour}:${minute}`;

    return {
      time,
      hour,
      minute,
    };
  }

  getWechatToken(func) {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    };

    axios
      .get(
        "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx631d482c48976d13&secret=e1fc9f7c7aa8f00cd443052181ffa641",
        {
          headers,
        }
      )
      .then((data) => {
        const d = data.data;
        const access_token = d.access_token;
        func && func(access_token);
      });
  }
}

class NotiifyRegis {
  constructor(o = {}) {
    // 微信推送模板id
    this.template_id = o.template_id;
    // 时刻推送及想说的话 格式： 对象
    this.time_list = o.time_list;

    // 想要推给谁 格式 推送人员微信公众号关注数组
    this.to_user = o.to_user;

    // 工具类
    this.utilsMethods = new utilMethods();
    this.token = o.wechatToken;
    this.notiifyActionUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${this.token}`;
  }

  async notiifyByRegis() {
    let that = this;

    let text = "";
    let hour = this.utilsMethods.getDate().hour;
    let self = "  无论何时都要元气满满~";
    if (hour >= 6) {
      text = "早上好，";
    }

    if (hour >= 12) {
      text = "中午好，";
    }

    if (hour >= 13) {
      text = "下午好，";
    }

    if (hour >= 18) {
      text = "晚上好，";
    }

    text += self;
    for (let index = 0; index < that.to_user.length; index++) {
      if (that.time_list[time]) {
        let t = that.time_list[time];
        let data = {
          touser: that.to_user[index],
          template_id: that.template_id,
          topcolor: "#FF0000",
          data: {
            text: {
              value: text,
              color: that.utilsMethods.getRandomColor(),
            },
            date: {
              value: "Ding Dong~：" + t.time,
              color: that.utilsMethods.getRandomColor(),
            },
            textContent: {
              value: "咻咻咻~：" + t.content,
              color: that.utilsMethods.getRandomColor(),
            },
          },
        };
        that.notiifyRequest(that.notiifyActionUrl, data);
      }
    }
  }
  async notiifyRequest(url, data) {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    };
    cons = await axios({
      url,
      method: "POST",
      data,
      headers,
    });
  }
}

const timeList = {
  "12:0": {
    time: "12:00",
    content: "二喜喜喜喜 ~ 干饭了~ 干饭了~~~ 🧋",
  },
};

function main() {
  console.log("xxxx推送程序执行");
  if (timeList[time]) {
    console.log("符合时间");
    new utilMethods().getWechatToken((token) => {
      new NotiifyRegis({
        to_user: [
          "ownfm5i6RMGzy3U0CnK8XD79CLOM",
          "ownfm5s2rAMeN3i6quBGry87eGS8",
        ],
        template_id: "NO18n2BN8sDnJ3Qcy3ChCZwibVh91OgC06Gtk1p7mBE",
        time_list: timeList,
        wechatToken: token,
      });
    });
  } else {
    console.log("中饭推送程序：不符合", time);
  }
}

module.exports.main = main;
