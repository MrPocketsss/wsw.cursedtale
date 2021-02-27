import redis from 'redis';
import { promisify } from 'util';

import UserModel from './user.js';
import makeRedisCache from './redis-cache.js';
import jwt from './tokens.js';

const redisCache = makeRedisCache({ redis, promisify });

export { jwt, UserModel, redisCache };
