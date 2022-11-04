const Service = require('egg').Service;

class MemberService extends Service {
  async render(path) {
    const csrf = this.ctx.csrf;

    return this.ctx.render(path, { csrf });
  }

  async showTable() {
    const userAccount = this.ctx.session.userAccount;
    const redisRecordListKey = 'records:' + userAccount;
    const redisRecordList = await this.app.redis.lrange(
      redisRecordListKey,
      0,
      99
    );
    const trasnactionRecordArray = [];

    for (const redisRecordJson of redisRecordList) {
      const record = JSON.parse(redisRecordJson);
      trasnactionRecordArray.push(record);
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
