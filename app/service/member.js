const Service = require('egg').Service;

class MemberService extends Service {
  async render(path) {
    const csrf = this.ctx.csrf;

    return this.ctx.render(path, { csrf });
  }

  async showTable() {
    const userAccount = this.ctx.session.userAccount;
    const redisRecordIdListKey = 'records:' + userAccount;
    const redisRecordIdList = await this.app.redis.lrange(
      redisRecordIdListKey,
      0,
      99
    );
    const trasnactionRecordArray = [];

    for (const recordId of redisRecordIdList) {
      const record = await this.app.redis.get(recordId);
      const recordJson = JSON.parse(record);
      trasnactionRecordArray.push(recordJson);
    }

    await this.ctx.render('member.html', {
      userAccount,
      trasnactionRecordArray,
    });
  }

  async signOut() {
    this.ctx.session = null;
  }
}

module.exports = MemberService;
