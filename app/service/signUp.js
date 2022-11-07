const Service = require('egg').Service;
const fs = require('fs');
const lua = fs.readFileSync('app/signUp.lua');

class SignUpService extends Service {
  async createAccount(userAccount, password) {
    const loadLua = await this.app.redis.script('load', lua);
    const currentTime = new Date().toLocaleString('zh-TW');
    const redisRecordListKey = 'records:' + userAccount;
    const checkAccount = await this.checkAccountExists(userAccount);

    if (!checkAccount) {
      const recordId = await this.app.redis.evalsha(
        loadLua,
        1,
        userAccount,
        password,
        currentTime
      );
      const redisRecordJson = JSON.stringify({
        recordId,
        amount: 1000,
        balance: 1000,
        createdAt: currentTime,
      });
      await this.app.redis.lpush(
        redisRecordListKey,
        redisRecordJson
      );
      await this.ctx.model.User.create({
        userAccount,
        password,
      });
      await this.ctx.model.Record.create({
        recordId,
        amount: 1000,
        balance: 1000,
        userAccount,
        createdAt: currentTime,
      });

      return this.ctx.redirect('/api/signIn');
    }

    this.ctx.body = '已註冊過的帳號';
  }

  async checkAccountExists(userAccount) {
    const findUser = await this.app.redis.get(
      userAccount
    );

    if (findUser) {
      return true;
    }
  }
}

module.exports = SignUpService;
