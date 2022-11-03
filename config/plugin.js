'use strict';

/** @type Egg.EggPlugin */
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.session = true;
