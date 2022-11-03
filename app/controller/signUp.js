'use strict';

const Controller = require('egg').Controller;

class SignUpController extends Controller {
  async index() {
    await this.service.member.render('signUp.html');
  }

  async create() {
    const ctx = this.ctx;
    const { userAccount, password } = ctx.request.body;

    await ctx.service.signUp.createAccount(
      userAccount,
      password
    );
  }
}

module.exports = SignUpController;
