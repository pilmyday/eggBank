const Service = require('egg').Service;

class SignInService extends Service {
  async signInRedis(userAccount, password) {
    const redisPassword = await this.app.redis.get(
      userAccount
    );
    if (password === redisPassword) {
      this.ctx.cookies.set('userAccount', userAccount);
      this.ctx.session.userAccount = userAccount;
      await this.checkRedisRecordList(userAccount);

      return this.ctx.redirect('/api/member');
    }
    await this.signInSql(userAccount, password);
  }

  async signInSql(userAccount, password) {
    const sqlUser = await this.ctx.model.User.findOne({
      where: { userAccount },
    });
    if (sqlUser === null) {
      return this.ctx.redirect('/api/signIn');
    }
    if (password === sqlUser.password) {
      this.ctx.cookies.set('userAccount', userAccount);
      this.ctx.session.userAccount = userAccount;
      await this.createRedisUserAccount(sqlUser.userAccount, sqlUser.password);
      await this.checkRedisRecordList(userAccount);

      return this.ctx.redirect('/api/member');
    }
    return this.ctx.redirect('/api/signIn');
  }

  async createRedisUserAccount(userAccount, password) {
    await this.app.redis.set(
      userAccount,
      password
    );
  }

  async checkRedisRecordList(userAccount) {
    const recordIdLatest = await this.app.redis.lindex(
      'records:' + userAccount,
      0
    );
    const sqlRecordLatest = await this.ctx.model.Record.findOne({
      where: { userAccount },
      order: [[ 'recordId', 'DESC' ]],
    });
    if (recordIdLatest !== sqlRecordLatest.recordId) {
      await this.updateRedisRecordList(userAccount);
    }
  }

  async updateRedisRecordList(userAccount) {
    const redisRecordIdListKey = 'records:' + userAccount;
    const balanceKey = 'balance:' + userAccount;
    const sqlRecordArray = await this.ctx.model.Record.findAll({
      where: { userAccount },
      order: [[ 'recordId', 'DESC' ]],
    });
    await this.app.redis.del(redisRecordIdListKey);
    await this.app.redis.set(
      balanceKey,
      sqlRecordArray[0].balance
    );
    for (const sqlRecord of sqlRecordArray) {
      const redisRecord = {
        amount: sqlRecord.amount,
        balance: sqlRecord.balance,
        createdAt: sqlRecord.createdAt,
      };

      await this.app.redis.set(
        sqlRecord.recordId,
        JSON.stringify(redisRecord)
      );
      await this.app.redis.rpush(
        redisRecordIdListKey,
        sqlRecord.recordId
      );
    }
  }
}

module.exports = SignInService;
