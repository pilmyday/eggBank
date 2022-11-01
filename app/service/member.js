const Service = require('egg').Service;

class MemberService extends Service {
  async render(path) {
    const csrf = this.ctx.csrf;

    return this.ctx.render(path, {
      csrf: csrf
    });
  }

  async showTable() {
    const userAccount = this.ctx.session.userAccount;
    const redisRecordListKey = 'records:' + userAccount;
    const redisRecordList = await this.app.redis.lrange(
      redisRecordListKey,
      0,
      99,
    );
    let trasnactionRecordArray = [];

    for (let i of redisRecordList) {
      const record = JSON.parse(await this.app.redis.get(i));
      trasnactionRecordArray.push(record);
    }

    await this.ctx.render('member.html', {
      userAccount,
      trasnactionRecordArray
    });
  }

  async signOut() {
    this.ctx.session = null;
  }
}

module.exports = MemberService;