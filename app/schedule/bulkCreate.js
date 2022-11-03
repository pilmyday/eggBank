const Subscription = require('egg').Subscription;

class bulkCreate extends Subscription {
  static get schedule() {
    return {
      interval: '1s',
      type: 'all',
    };
  }

  async subscribe() {
    const recordArray = [];
    const queueRecords = await this.app.redis.rpop(
      'queue',
      10000
    );
    if (queueRecords !== null) {
      for (const record of queueRecords) {
        recordArray.push(JSON.parse(record));
      }
      await this.ctx.service.transaction.bulkCreateSqlRecord(recordArray);
    }
  }
}

module.exports = bulkCreate;
