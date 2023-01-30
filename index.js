'use strict';


  
exports.main_handler = async (event, context) => {
    await require('./weChatWater').main()
    await require('./tvss').main()
    await require('./goHome').main()
    await require('./lunch').main()

    const promise = new Promise((resolve,reject) => {
        setTimeout(function() {
           resolve('成功')
           // reject('失败')
        }, 2000)
      })
      return promise
};

