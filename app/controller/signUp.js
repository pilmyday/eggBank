'use strict';

const user = require('../model/user');

const Controller = require('egg').Controller;

class SignUpController extends Controller {
  async index() {
    const ctx = this.ctx;
        
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