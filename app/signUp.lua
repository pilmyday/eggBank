local userAccount = KEYS[1];
local password = ARGV[1];
local balanceKey = 'balance:' .. userAccount;
local recordId = redis.call(
  'incr',
  'recordId'
);

redis.call(
  'mset',
  userAccount,
  password,
  balanceKey,
  1000
);

return recordId;
