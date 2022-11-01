const Service = require('egg').Service;
const fs = require('fs');
const lua = fs.readFileSync('app/trans.lua');

class TransactionService extends Service {
  async transaction(amount) {
    const userAccount = this.ctx.session.userAccount;
    const loadLua = await this.app.redis.script('load', lua);
    const currentTime = new Date().toLocaleString("zh-TW");
    const redisRecordListKey = 'records:' + userAccount;
    const redisResult = await this.app.redis.evalsha(
      loadLua,
      1,
      userAccount,
      amount,
      currentTime
    );
    const recordId = redisResult[0];
    const newAmount = redisResult[1];
    const newBalance = redisResult[2];
    const newRecord = JSON.stringify({
      recordId: recordId,
      amount: newAmount,
      balance: newBalance,
      userAccount: userAccount,
      createdAt: currentTime
    });

    await this.app.redis.lpush(
      redisRecordListKey,
      recordId
    );
    await this.app.redis.lpush(
      'queue',
      newRecord
    );
  }
    
  async bulkCreateSqlRecord(recordArray) {
    this.ctx.model.Record.bulkCreate(recordArray);
  }
}

module.exports = TransactionService;