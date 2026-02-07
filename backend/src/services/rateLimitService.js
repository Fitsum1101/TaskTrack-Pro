const { redisClient } = require('../config/redisConfig');
const ApiError = require('../utils/apiError');


const DAILY_LIMIT = process.env.NODE_ENV.trim() === 'development' ? 10 : 300;

const RATE_LIMIT_PREFIX = 'rate_limit:smart_sourcing:';
const USAGE_PREFIX = 'usage:smart_sourcing:';

const getRateLimitKey = userId => `${RATE_LIMIT_PREFIX}${userId}`;
const getUsageKey = userId => `${USAGE_PREFIX}${userId}`;

const getCurrentUTCDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const getNextMidnightUTC = () => {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow;
};

const getTTLUntilMidnight = () => {
  const now = new Date();
  const midnight = getNextMidnightUTC();
  return Math.ceil((midnight - now) / 1000);
};

const checkRateLimit = async userId => {
  if (!redisClient) {
    throw new ApiError(500, 'Redis client not available');
  }

  const currentDate = getCurrentUTCDate();
  const rateLimitKey = `${getRateLimitKey(userId)}:${currentDate}`;

  try {
    const currentCount = await redisClient.get(rateLimitKey);
    const count = parseInt(currentCount) || 0;

    if (count >= DAILY_LIMIT) {
      const ttl = await redisClient.ttl(rateLimitKey);
      const resetTime = new Date(Date.now() + ttl * 1000);

      throw new ApiError(429, 'Daily rate limit exceeded for smart sourcing', {
        currentUsage: count,
        dailyLimit: DAILY_LIMIT,
        remainingRequests: 0,
        resetTime: resetTime.toISOString(),
        retryAfter: ttl,
      });
    }

    return {
      allowed: true,
      currentUsage: count,
      remainingRequests: DAILY_LIMIT - count,
      dailyLimit: DAILY_LIMIT,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Error checking rate limit', { originalError: error.message });
  }
};

const incrementRateLimit = async userId => {
  if (!redisClient) {
    throw new ApiError(500, 'Redis client not available');
  }

  const currentDate = getCurrentUTCDate();
  const rateLimitKey = `${getRateLimitKey(userId)}:${currentDate}`;
  const usageKey = `${getUsageKey(userId)}:${currentDate}`;

  try {
    const pipeline = redisClient.pipeline();

    pipeline.incr(rateLimitKey);
    pipeline.expire(rateLimitKey, getTTLUntilMidnight());

    pipeline.incr(usageKey);
    pipeline.expire(usageKey, getTTLUntilMidnight());

    const results = await pipeline.exec();

    if (results.some(([err]) => err)) {
      throw new Error('Pipeline execution failed');
    }

    const newCount = results[0][1];

    if (newCount > DAILY_LIMIT) {
      const ttl = await redisClient.ttl(rateLimitKey);
      const resetTime = new Date(Date.now() + ttl * 1000);

      throw new ApiError(429, 'Daily rate limit exceeded for smart sourcing', {
        currentUsage: newCount,
        dailyLimit: DAILY_LIMIT,
        remainingRequests: 0,
        resetTime: resetTime.toISOString(),
        retryAfter: ttl,
      });
    }

    return {
      success: true,
      currentUsage: newCount,
      remainingRequests: DAILY_LIMIT - newCount,
      dailyLimit: DAILY_LIMIT,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Error incrementing rate limit', { originalError: error.message });
  }
};

const getRateLimitStatus = async userId => {
  if (!redisClient) {
    return {
      currentUsage: 0,
      remainingRequests: DAILY_LIMIT,
      dailyLimit: DAILY_LIMIT,
      resetTime: getNextMidnightUTC().toISOString(),
    };
  }

  const currentDate = getCurrentUTCDate();
  const rateLimitKey = `${getRateLimitKey(userId)}:${currentDate}`;

  try {
    const currentCount = await redisClient.get(rateLimitKey);
    const count = parseInt(currentCount) || 0;
    const ttl = await redisClient.ttl(rateLimitKey);

    let resetTime;
    if (ttl > 0) {
      resetTime = new Date(Date.now() + ttl * 1000);
    } else {
      resetTime = getNextMidnightUTC();
    }

    return {
      currentUsage: count,
      remainingRequests: Math.max(0, DAILY_LIMIT - count),
      dailyLimit: DAILY_LIMIT,
      resetTime: resetTime.toISOString(),
    };
  } catch (error) {
    console.error('Error getting rate limit status:', error);
    return {
      currentUsage: 0,
      remainingRequests: DAILY_LIMIT,
      dailyLimit: DAILY_LIMIT,
      resetTime: getNextMidnightUTC().toISOString(),
    };
  }
};

const resetUserRateLimit = async userId => {
  if (!redisClient) {
    throw new ApiError(500, 'Redis client not available');
  }

  const currentDate = getCurrentUTCDate();
  const rateLimitKey = `${getRateLimitKey(userId)}:${currentDate}`;
  const usageKey = `${getUsageKey(userId)}:${currentDate}`;

  try {
    await redisClient.del(rateLimitKey, usageKey);
    return { success: true, message: 'Rate limit reset successfully' };
  } catch (error) {
    throw new ApiError(500, 'Error resetting rate limit', { originalError: error.message });
  }
};

module.exports = {
  checkRateLimit,
  incrementRateLimit,
  getRateLimitStatus,
  resetUserRateLimit,
  DAILY_LIMIT,
};
