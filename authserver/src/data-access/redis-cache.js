export default function makeRedisCache({ redis, promisify }) {
  const client = redis.createClient({ port: 6379, host: 'redisDB' });

  client.on('error', (error) => {
    throw new Error(error);
  });

  client.on('connect', () => {
    console.log('Connected to Redis');
  });

  const getToken = promisify(client.get).bind(client);
  const setToken = promisify(client.set).bind(client);
  const deleteToken = promisify(client.del).bind(client);

  return Object.freeze({ deleteToken, getToken, setToken });
}
