'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;

    await queryInterface.createTable('users', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_account: {
        type: STRING(20),
        unique: true,
      },
      password: STRING(20),
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('records', {
      record_id: { type: INTEGER, primaryKey: true, autoIncrement:true },
      amount: INTEGER,
      balance: {
        type: INTEGER,
        default: 0,
      },
      user_account: STRING(20),
      created_at: STRING(60),
      updated_at: DATE,
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('records');
  },
};