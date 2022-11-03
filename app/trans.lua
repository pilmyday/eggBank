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
if amount + balance < 0 then
  amount = 0;
end
newBalance = redis.call(
  'incrby',
  balanceKey,
  amount
);

return {
  recordId,
  amount,
  newBalance
};
