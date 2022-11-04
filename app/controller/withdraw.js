'use strict';

const Controller = require('egg').Controller;

class WithdrawController extends Controller {
  async index() {
    await this.service.member.render('withdraw.html');
  }

  async create() {
    const ctx = this.ctx;
    const requestBody = ctx.request.body;
    const withdraw = '-' + requestBody.withdraw;
    const transactionResult = await this.service.transaction.transaction(withdraw);

    if (transactionResult) {
      return ctx.redirect('/api/member');
    }

    ctx.body = '餘額不足';
  }
}

module.exports = WithdrawController;
