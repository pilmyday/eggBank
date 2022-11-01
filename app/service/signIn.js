const Service = require('egg').Service;

class SignInService extends Service {
  async signInRedis (userAccount, password) {
    const redisPassword = await this.app.redis.get(
      userAccount
    );
    if (password === redisPassword) {
      this.ctx.cookies.set('userAccount', userAccount);
      this.ctx.session.userAccount = userAccount;
      await this.checkRedisRecordList(userAccount);

      return this.ctx.redirect('/api/member');
    } else {
      await this.signInSql(userAccount, password);
    }
  }

  async signInSql(userAccount, password) {
    const SqlUser = await this.ctx.model.User.findOne({
      where: {
        'userAccount': userAccount
      }
    });
    if (SqlUser === null) {
      return this.ctx.redirect('/api/signIn');
    }
    if (password === SqlUser.password) {
      this.ctx.cookies.set('userAccount', userAccount);
      this.ctx.session.userAccount = userAccount;
      await this.createRedisUserAccount(SqlUser.userAccount, SqlUser.password);
      await this.checkRedisRecordList(userAccount);

      return this.ctx.redirect('/api/member');
    } else {
      return this.ctx.redirect('/api/signIn');
    }
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
    const SqlRecordLatest = await this.ctx.model.Record.findOne({
      where: {
        'userAccount': userAccount
      },
      order: [['recordId', 'DESC']]
    });
    if (recordIdLatest != SqlRecordLatest.recordId) {
      await this.updateRedisRecordList(userAccount);
    }
  }

  async updateRedisRecordList(userAccount) {
    const redisRecordListKey = 'records:' + userAccount;
    const sqlRecordArray = await this.ctx.model.Record.findAll({
      where: {
        'userAccount': userAccount
      },
      order: [['recordId', 'DESC']]
    });
    await this.app.redis.del(
      'records:' + userAccount
    );
    await this.app.redis.set(
      'balance:' + userAccount,
      sqlRecordArray[0].balance
    );
    for (let i of sqlRecordArray) {
      const redisRecord = {
        'amount': i.amount,
        'balance': i.balance,
        'createdAt': i.createdAt,
      };

      await this.app.redis.set(
        i.recordId,
        JSON.stringify(redisRecord)
      );
      await this.app.redis.rpush(
        redisRecordListKey,
        i.recordId
      );
    }
  }
}

module.exports = SignInService;