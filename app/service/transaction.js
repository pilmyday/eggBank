const Service = require('egg').Service;
const fs = require('fs');
const lua = fs.readFileSync('app/trans.lua');

class TransactionService extends Service {
  async transaction(amount) {
    const userAccount = this.ctx.session.userAccount;
    const loadLua = await this.app.redis.script('load', lua);
    const currentTime = new Date().toLocaleString('zh-TW');
    const redisRecordListKey = 'records:' + userAccount;
    const redisResult = await this.app.redis.evalsha(
      loadLua,
      1,
      userAccount,
      amount
    );
    const recordId = redisResult[0];
    const newBalance = redisResult[1];
    const result = redisResult[2];
    if (result) {
      const redisRecordJson = JSON.stringify({
        recordId,
        amount,
        balance: newBalance,
        createdAt: currentTime,
      });
      const sqlRecordJson = JSON.stringify({
        recordId,
        amount,
        balance: newBalance,
        userAccount,
        createdAt: currentTime,
      });

      await this.app.redis.lpush(
        redisRecordListKey,
        redisRecordJson
      );
      await this.app.redis.lpush(
        'queue',
        sqlRecordJson
      );

      return true;
    }

    return false;
  }

  async bulkCreateSqlRecord(recordArray) {
    this.ctx.model.Record.bulkCreate(recordArray);
  }
}

module.exports = TransactionService;
