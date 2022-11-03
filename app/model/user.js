'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userAccount: STRING(20),
    password: STRING(20),
    createdAt: DATE,
    updatedAt: DATE,
  });

  return User;
};
