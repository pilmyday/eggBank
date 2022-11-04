local balanceKey = 'balance:' .. KEYS[1];
local amount = tonumber(ARGV[1]);
local balance = tonumber(redis.call(
  'get',
  balanceKey
));
local recordId, newBalance, result;
if amount + balance >= 0 then
  recordId = redis.call(
    'incr',
    'recordId'
  );
  newBalance = redis.call(
    'incrby',
    balanceKey,
    amount
  );
  result = true;
else
  result = false;
end

return {
  recordId,
  newBalance,
  result
};
