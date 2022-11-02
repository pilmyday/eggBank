const Service = require('egg').Service;
const fs = require('fs');
const lua = fs.readFileSync('app/signUp.lua');

class SignUpService extends Service {
  async createAccount(userAccount, password) {
    const loadLua = await this.app.redis.script('load', lua);
    const currentTime = new Date().toLocaleString('zh-TW');
    const checkAccount = await this.checkAccountExists(userAccount);

    if (!checkAccount) {
      const result = await this.app.redis.evalsha(
        loadLua,
        1,
        userAccount,
        password,
        currentTime
      );
      const recordId = result[0];
      const amount = result[1];
      const balance = result[2];
      const createdAt = result[3];

      await this.app.redis.lpush(
        'records:' + userAccount,
        recordId
      );
      this.ctx.model.User.create({
        userAccount,
        password,
      });
      this.ctx.model.Record.create({
        recordId,
        amount,
        balance,
        userAccount,
        createdAt,
      });

      return this.ctx.redirect('/api/signIn');
    }
    this.ctx.body = checkAccount;
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
