local userAccount = KEYS[1];
local password = ARGV[1];
local currentTime = ARGV[2];
local balanceKey = 'balance' .. userAccount;
local recordId = redis.call(
  'incr',
  'recordId'
);
local redisRecordJson = cjson.encode({
  amount = 0,
  balance = 0,
  createdAt = currentTime
});

redis.call(
  'mset',
  userAccount,
  password,
  recordId,
  redisRecordJson,
  balanceKey,
  0
);

return recordId;
