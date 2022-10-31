'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.resources('signUps', '/api/signUp', controller.signUp);
  router.resources('signIns', '/api/signIn', controller.signIn);
  router.post('/api/signIn', controller.signIn.signIn);
  router.resources('members', '/api/member', controller.member);
  router.get('/api/member/signOut', controller.member.signOut);
  router.resources('deposits', '/api/deposit', controller.deposit);
  router.resources('withdraws', '/api/withdraw', controller.withdraw);

};
