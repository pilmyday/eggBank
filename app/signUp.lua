local userAccount = KEYS[1];
local password = ARGV[1];
local balanceKey = 'balance:' .. userAccount;
local initialBalance = 1000;
local recordId = redis.call(
  'incr',
  'recordId'
);

redis.call(
  'mset',
  userAccount,
  password,
  balanceKey,
  initialBalance
);

return recordId;
