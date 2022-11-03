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
    await this.service.transaction.transaction(withdraw);

    ctx.redirect('/api/member');
  }
}

module.exports = WithdrawController;
