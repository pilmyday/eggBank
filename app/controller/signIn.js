'use strict';

const Controller = require('egg').Controller;

class SignInController extends Controller {
  async index() {
    await this.service.member.render('index.html');
  }

  async signIn() {
    const ctx = this.ctx;
    const { userAccount, password } = ctx.request.body;
    await this.service.signIn.signInRedis(userAccount, password);
  }
}

module.exports = SignInController;
