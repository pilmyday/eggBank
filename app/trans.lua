local balanceKey = 'balance:' .. KEYS[1];
local amount = tonumber(ARGV[1]);
local currentTime = ARGV[2];
local recordId = redis.call(
  'incr',
  'recordId'
);
local balance = tonumber(redis.call(
  'get',
  balanceKey
));
local newBalance;
local newAmount;
if amount + balance < 0 then
  newAmount = 0;
  newBalance = balance;
else
  newAmount = amount;
  newBalance = redis.call(
    'incrby',
    balanceKey,
    amount
  );
end

local newRedisRecord = cjson.encode({
  amount = newAmount,
  balance = newBalance,
  createdAt = currentTime
});

redis.call(
  'set',
  recordId,
  newRedisRecord
);

return {
  recordId,
  newAmount,
  newBalance
};
