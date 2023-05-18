const Redis = require("ioredis");

const client = new Redis({
  host: process.env.REDIS_DATABASE_HOST,
  port: process.env.REDIS_DATABASE_PORT,
  password: process.env.REDIS_DATABASE_PASSWORD,
});

const LIMIT_PER_MIN = 10;
const SYSTEM_LIMIT_PER_MIN = 10; // Adjust the system-wide limit as per your requirements
const LIMIT_PER_MONTH = 2; // Adjust the monthly limit as per your requirements

async function rate_limiter(req, res, next) {
  const ip = req.ip;
  const clientId = req.headers["client-id"]; // Retrieve the client ID from request headers

  if (!ip || !clientId) {
    return res.status(400).json({
      message: "IP or clientId not found",
    });
  }

  // Check system-wide rate limit based on client ID
  const systemKey = `system_rate_limit`;
  const systemData = await client.get(systemKey);

  if (!systemData) {
    client.set(
      systemKey,
      JSON.stringify({
        timestamp: new Date().getTime(),
        system_tokens_remaining: SYSTEM_LIMIT_PER_MIN,
      })
    );
  } else {
    const systemRateLimit = JSON.parse(systemData);

    if (systemRateLimit.system_tokens_remaining <= 0) {
      return res.status(429).json({
        message: `System-wide limit of ${SYSTEM_LIMIT_PER_MIN} requests per minute reached`,
      });
    }
  }

  // Deduct system rate limit token remaining
  const systemRateLimitData = JSON.parse(await client.get(systemKey));
  const currentTime = new Date().getTime();
  const timeDiff = currentTime - systemRateLimitData.timestamp;
  const tokensToAdd = Math.floor(timeDiff / 60000); // Number of tokens to add based on the elapsed minutes

  if (tokensToAdd > 0) {
    const tokensRemaining = Math.min(
      systemRateLimitData.system_tokens_remaining + tokensToAdd,
      SYSTEM_LIMIT_PER_MIN
    );

    systemRateLimitData.timestamp = currentTime;
    systemRateLimitData.system_tokens_remaining = tokensRemaining;

    client.set(systemKey, JSON.stringify(systemRateLimitData));
  }

  if (systemRateLimitData.system_tokens_remaining <= 0) {
    return res.status(429).json({
      message: `System-wide limit of ${SYSTEM_LIMIT_PER_MIN} requests per minute reached`,
    });
  }

  // Check client-specific rate limit
  const userKey = `client_rate_limit:${clientId}`;
  const user_data = await client.get(userKey);

  if (!user_data) {
    client.set(
      userKey,
      JSON.stringify({
        timestamp: new Date().getTime(),
        per_minute_usage: LIMIT_PER_MIN,
        monthly_usage: LIMIT_PER_MONTH,
      })
    );
  } else {
    const clientRateLimit = JSON.parse(user_data);
    if (clientRateLimit.per_minute_usage <= 0) {
      return res.status(429).json({
        message: `You have exceeded the limit of ${LIMIT_PER_MIN} requests per minute for client ${clientId}`,
      });
    }
    if (clientRateLimit.monthly_usage <= 0) {
      return res.status(429).json({
        message: `Monthly limit of ${LIMIT_PER_MONTH} requests reached`,
      });
    }
  }

  // Reduce tokens remaining for both system and client rate limits
  const clientRateLimitData = JSON.parse(await client.get(userKey));
  const current_time = new Date().getTime();
  client.set(
    userKey,
    JSON.stringify({
      timestamp: current_time,
      per_minute_usage: clientRateLimitData.per_minute_usage - 1,
      monthly_usage: clientRateLimitData.monthly_usage - 1,
    })
  );

  client.set(
    systemKey,
    JSON.stringify({
      timestamp: current_time,
      system_tokens_remaining: systemRateLimitData.system_tokens_remaining - 1,
    })
  );

  return next();
}

module.exports = {
  rate_limiter,
};
