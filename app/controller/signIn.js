'use strict';

const { redis } = require('../../config/plugin');
const record = require('../model/record');
const user = require('../model/user');

const Controller = require('egg').Controller;

class SignInController extends Controller {
    async index() {
        const ctx = this.ctx;
        
        await this.service.member.render('index.html');
    }

    async signIn() {
        const ctx = this.ctx;
        const { userAccount, password } = ctx.request.body;
        await this.service.signIn.signInRedis(userAccount, password);
    }
}

module.exports = SignInController;