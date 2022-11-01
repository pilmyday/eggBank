'use strict';

const record = require('../model/record');

const Controller = require('egg').Controller;

class MemberController extends Controller {
  async index() {
    const ctx = this.ctx;
    
    await this.service.member.showTable();
  }

  async signOut() {
    const ctx = this.ctx;
    await this.service.member.signOut();

    ctx.redirect('/api/signIn');
  }
}

module.exports = MemberController;