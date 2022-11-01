'use strict';

const { sequelize } = require('../../config/plugin');

const Controller = require('egg').Controller;

class DepositController extends Controller {
  async index() {
    const ctx = this.ctx;

    await this.service.member.render('deposit.html');
  }
    
  async create() {
    const ctx = this.ctx;
    const requestBody = ctx.request.body;
    const deposit = requestBody.deposit;
    
    await this.service.transaction.transaction(deposit);

    ctx.redirect('/api/member');
  }
}

module.exports = DepositController;