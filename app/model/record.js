'use strict';

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Record = app.model.define('record', {
    recordId: { type: INTEGER, primaryKey: true, autoIncrement:true },
    amount: INTEGER,
    balance: {
      type: INTEGER,
      default: 0,
    },
    userAccount: STRING(20),
    createdAt: STRING(60),
    updatedAt: DATE,
  });

  return Record;
};