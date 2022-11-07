const Service = require('egg').Service;

class SignInService extends Service {
  async signInRedis(userAccount, password) {
    const redisPassword = await this.app.redis.get(
      userAccount
    );
    if (password === redisPassword) {
      const signInResult = await this.signInSuccess(userAccount);
      await this.checkRedisRecordList(userAccount);

      return signInResult;
    }
    await this.signInSql(userAccount, password);
  }

  async signInSuccess(userAccount) {
    this.ctx.cookies.set('userAccount', userAccount);
    this.ctx.session.userAccount = userAccount;

    return this.ctx.redirect('/api/member');
  }

  async signInSql(userAccount, password) {
    const sqlUser = await this.ctx.model.User.findOne({
      where: { userAccount },
    });
    if (sqlUser === null) {
      this.ctx.body = '不存在的帳號';

      return;
    }
    if (password === sqlUser.password) {
      const signInResult = await this.signInSuccess(userAccount);

      await this.createRedisUserAccount(sqlUser.userAccount, sqlUser.password);
      await this.checkRedisRecordList(userAccount);

      return signInResult;
    }

    this.ctx.body = '帳號或密碼錯誤';
  }

  async createRedisUserAccount(userAccount, password) {
    await this.app.redis.set(
      userAccount,
      password
    );
  }

  async checkRedisRecordList(userAccount) {
    const recordLatestJson = await this.app.redis.lindex(
      'records:' + userAccount,
      0
    );
    const recordLatest = JSON.parse(recordLatestJson);
    const sqlRecordLatest = await this.ctx.model.Record.findOne({
      where: { userAccount },
      order: [[ 'recordId', 'DESC' ]],
    });
    if (recordLatest === null || recordLatest.recordId !== sqlRecordLatest.recordId) {
      await this.updateRedisRecordList(userAccount);
    }
  }

  async updateRedisRecordList(userAccount) {
    const redisRecordListKey = 'records:' + userAccount;
    const balanceKey = 'balance:' + userAccount;
    const sqlRecordArray = await this.ctx.model.Record.findAll({
      where: { userAccount },
      order: [[ 'recordId', 'DESC' ]],
    });
    await this.app.redis.del(redisRecordListKey);
    await this.app.redis.set(
      balanceKey,
      sqlRecordArray[0].balance
    );
    for (const sqlRecord of sqlRecordArray) {
      const redisRecord = JSON.stringify({
        recordId: sqlRecord.recordId,
        amount: sqlRecord.amount,
        balance: sqlRecord.balance,
        createdAt: sqlRecord.createdAt,
      });

      await this.app.redis.rpush(
        redisRecordListKey,
        redisRecord
      );
    }
  }
}

module.exports = SignInService;
