'use strict';

const Controller = require('egg').Controller;

class WithdrawController extends Controller {
  async index() {
    await this.service.member.render('withdraw.html');
  }

  async create() {
    const ctx = this.ctx;
    const requestBody = ctx.request.body;
    const money = await this.service.transaction.toInt(requestBody.withdraw);
    if (money > 0 && money <= 10000000) {
      const withdraw = '-' + money;
      const transactionResult = await this.service.transaction.transaction(withdraw);

      if (transactionResult) {
        return ctx.redirect('/api/member');
      }

      ctx.body = '餘額不足';
    } else {
      ctx.body = '金額必須在1~10000000以內';
    }
  }
}

module.exports = WithdrawController;
