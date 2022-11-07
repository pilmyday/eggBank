'use strict';

const Controller = require('egg').Controller;

class DepositController extends Controller {
  async index() {
    await this.service.member.render('deposit.html');
  }

  async create() {
    const ctx = this.ctx;
    const requestBody = ctx.request.body;
    const deposit = await this.service.transaction.toInt(requestBody.deposit);
    if (deposit > 0) {
      await this.service.transaction.transaction(deposit);

      return ctx.redirect('/api/member');
    }

    ctx.body = '金額不得小於或等於0';
  }
}

module.exports = DepositController;
